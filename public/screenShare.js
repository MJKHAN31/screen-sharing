const socket = io(); // Connect to the server

let canvas, context, screenStream;

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('screenCanvas');
    context = canvas.getContext('2d');

    // Buttons
    const startShareBtn = document.getElementById('startShare');
    const stopShareBtn = document.getElementById('stopShare');
    const fullScreenBtn = document.getElementById('fullScreen');

    startShareBtn.addEventListener('click', startScreenShare);
    stopShareBtn.addEventListener('click', stopScreenShare);
    fullScreenBtn.addEventListener('click', toggleFullScreen);

    // Listen for screen data
    socket.on('screen-data', (data) => {
        if (data) {
            const img = new Image();
            img.onload = () => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = data;
        } else {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    });
});

async function startScreenShare() {
    try {
        // Ensure mediaDevices and getDisplayMedia are available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
            throw new Error('Screen sharing is not supported in this browser.');
        }

        screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = screenStream;
        video.play();

        // Update UI
        document.getElementById('startShare').disabled = true;
        document.getElementById('stopShare').disabled = false;

        // Capture frames and send them to the server
        const captureInterval = setInterval(() => {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const frame = canvas.toDataURL('image/webp'); // Convert to base64
            socket.emit('screen-data', frame);
        }, 1);

        // Stop sharing on stream end
        screenStream.getVideoTracks()[0].addEventListener('ended', () => {
            clearInterval(captureInterval);
            stopScreenShare();
        });
    } catch (err) {
        console.error('Screen sharing failed:', err.message || err);
    }
}


function stopScreenShare() {
    if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
        screenStream = null;
    }
    socket.emit('screen-data', null); // Stop sharing

    // Update UI
    document.getElementById('startShare').disabled = false;
    document.getElementById('stopShare').disabled = true;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function toggleFullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
            console.error(`Error exiting full screen: ${err.message}`);
        });
    } else {
        canvas.requestFullscreen().catch((err) => {
            console.error(`Error entering full screen: ${err.message}`);
        });
    }
}
