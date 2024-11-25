// This script is the client-side code for a simple screen sharing app.
// It uses the Socket.IO library to communicate with the server.
// When the user clicks the "Share Screen" button, it prompts the user to select a screen to share.
// It then sends the selected screen to the server, which relays it to any connected clients.
// The clients receive the screen and display it in a video element.
// The app also handles ICE candidates, which are necessary for establishing a peer-to-peer connection.

const socket = io();
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const shareScreenButton = document.getElementById('shareScreenButton');

let localStream;
let peerConnection;
const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

shareScreenButton.onclick = async () => {
    try {
        // Get the user's screen
        localStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        localVideo.srcObject = localStream;

        // Create a peer connection
        peerConnection = new RTCPeerConnection(configuration);

        // Handle the peer connection receiving a track
        peerConnection.ontrack = event => {
            console.log('Track received:', event);
            if (event.streams[0]) {
                remoteVideo.srcObject = event.streams[0];
            }
        };

        // Handle the peer connection receiving an ICE candidate
        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                console.log('ICE candidate:', event.candidate);
                socket.emit('ice-candidate', event.candidate);
            } else {
                console.log('End of ICE candidates');
            }
        };

        // Add the user's screen tracks to the peer connection
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        // Create an offer and send it to the server
        const offer = await peerConnection.createOffer();
        console.log('Offer created:', offer);
        await peerConnection.setLocalDescription(offer);
        socket.emit('offer', offer);
    } catch (err) {
        console.error('Error accessing media devices.', err);
    }
};

// Handle an offer from the server
socket.on('offer', async (offer) => {
    console.log('Offer received:', offer);
    if (!peerConnection) {
        peerConnection = new RTCPeerConnection(configuration);
        peerConnection.ontrack = event => {
            console.log('Track received:', event);
            if (event.streams[0]) {
                remoteVideo.srcObject = event.streams[0];
            }
        };
        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                console.log('ICE candidate:', event.candidate);
                socket.emit('ice-candidate', event.candidate);
            } else {
                console.log('End of ICE candidates');
            }
        };
    }

    // Set the offer as the remote description
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    console.log('Answer created:', answer);
    await peerConnection.setLocalDescription(answer);
    socket.emit('answer', answer);
});

// Handle an answer from the server
socket.on('answer', async (answer) => {
    console.log('Answer received:', answer);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

// Handle an ICE candidate from the server
socket.on('ice-candidate', async (candidate) => {
    console.log('ICE candidate received:', candidate);
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});

