# Screen Sharing App

A simple and seamless screen-sharing app powered by **Socket.IO**, allowing connected users to share and view screens in real-time. 

## Features
- Real-time screen sharing for connected users.
- Full-screen viewing mode for an immersive experience.
- Responsive and user-friendly interface.
- Lightweight and easy to set up.

## Technologies Used
- **Node.js**: Backend server.
- **Socket.IO**: Real-time communication.
- **HTML5 Canvas**: Rendering shared screens.
- **Nginx** (Optional): Reverse proxy for public access.

## Requirements
- Node.js v18.x or higher.
- A VPS or local server for hosting.

## Installation and Setup

### 1. Clone the Repository
```
git clone https://github.com/your-repo/screen-sharing-app.git
cd screen-sharing-app
```
### 2. Install Dependencies
```npm install```

### 3. Run the Server
```node server.js```

The app will start running at http://localhost:3000.

## Full Screen Mode
Users can click the Full Screen button to view the shared screen in full-screen mode. Press Esc to exit full-screen.

# Folder Structure
```
screen-sharing-app/
├── public/
│   ├── index.html         # Frontend HTML file
│   ├── screenShare.js     # Frontend JavaScript
├── server.js              # Node.js server file
├── package.json           # Dependencies and scripts
```

## License
This project is licensed under the MIT License.

## Contributing
Contributions are welcome! Feel free to fork the project and submit a pull request.
