const express = require('express');
const socketIO = require('socket.io');
const chalk = require('chalk');
const https = require('https');
const fs = require('fs');

const app = express();
const server = https.createServer(
    {
        key: fs.readFileSync('/Users/Ali/vscode_live_server.key.pem'),
        cert: fs.readFileSync('/Users/Ali/vscode_live_server.cert.pem'),
    },
    app
);
const io = socketIO(server);
const port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/chat.html');
});

app.use((req, res) => {
    res.sendFile(__dirname + '/pages/404.html');
});

io.on('connection', (socket) => {
    socket.on('signaling', (objData) => {
        socket.broadcast.emit('signaling', objData);
    });
});

server.listen(port, () => {
    console.log(chalk.rgb(255, 255, 0)('Server running...'));
});
