const express = require('express');
const socketIO = require('socket.io');
const chalk = require('chalk');
const http = require('http');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/chat.html');
});

app.use((req, res) => {
    res.sendFile(__dirname + '/pages/404.html');
});

server.listen(port, () => {
    console.log(chalk.rgb(255, 255, 0)('Server running...'));
});
