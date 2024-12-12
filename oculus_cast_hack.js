/**
 * This script captures video from the webcam and sends it to the server.
 *
 * 1. Go to https://oculus.com/casting and cast your occulus screen to your computer
 * 2. Copy and past this script into the console.
 *
 * Note if you get websocket error on your localhost, it might be due to HSTS policy.
 * set by webapp dev env.  You need to either use a different browser, or follow
 * https://stackoverflow.com/questions/25277457/google-chrome-redirecting-localhost-to-https
 * and clear your HSTS policy.
 *
 * NOTE: this relies on the fact that oculus.com allows CORS to ws://localhost:*
 * for some reason :-)
 */
const canvas = document.createElement('canvas');
function getVideoURL() {
    const myVideo = document.querySelector('video');
    canvas.width = myVideo.videoWidth;
    canvas.height = myVideo.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(myVideo, 0, 0, myVideo.videoWidth, myVideo.videoHeight);
    url = canvas.toDataURL();
    console.log(`ImageURL: ${url.substring(0, 40)}...`);
    return url;
}
function setupIntervalSnapshot(socket) {
    // Function to post JSON object to WebSocket
    function postJsonToWebSocket(socket, jsonObject) {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(jsonObject));
            console.log('JSON object sent to WebSocket:', jsonObject);
        } else {
            console.error('WebSocket is not open. ReadyState:', socket.readyState);
        }
    }
    const intervalId = setInterval(() => {
        postJsonToWebSocket(socket, {
            image: getVideoURL()
        });
    }, 3000);
    console.log('Interval set up:', intervalId);
}
function setupWebSocket(successCallback) {
    // Create a WebSocket connection to localhost
    const socket = new WebSocket('ws://localhost:3000/video_feed');
    // Connection opened
    socket.addEventListener('open', (event) => {
        console.log('WebSocket connection established');
        successCallback(socket);
    });
    // Listen for messages
    socket.addEventListener('message', (event) => {
        console.log('Message from server:', event.data);
    });
    // Connection closed
    socket.addEventListener('close', (event) => {
        console.log('WebSocket connection closed');
    });
    // Handle any errors
    socket.addEventListener('error', (event) => {
        console.error('WebSocket error:', event);
    });
    return socket;
}

setupWebSocket(setupIntervalSnapshot);
