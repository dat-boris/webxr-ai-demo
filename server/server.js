const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = 3000;

// A base64 image of: data:image/png;base64....
let sharedImageURL = null;

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.image) {
            sharedImageURL = data.image;
            console.log('Received:', sharedImageURL.substring(0, 40));
            ws.send('ok');
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

app.get('/image', (req, res) => {
    if (!sharedImageURL) {
        return res.status(404).send('No image data available.');
    }
    const base64Data = sharedImageURL.replace(/^data:image\/png;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
