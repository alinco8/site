const express = require('express');
const webPush = require('web-push');
const https = require('https');
const fs = require('fs');

const app = express();
const server = https.createServer(
    {
        cert: fs.readFileSync(__dirname + '/etc/https/server.crt'),
        key: fs.readFileSync(__dirname + '/etc/https/server.key'),
    },
    app
);
const vapidKeys = webPush.generateVAPIDKeys();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    })
);
app.use(express.static(__dirname + '/public'));

webPush.setVapidDetails(
    'mailto:ali0207k@gmail.com', // 第一引数は'mailto:～'というフォーマットでないとだめらしい
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/key', (req, res) => {
    res.send(vapidKeys.publicKey);
});

app.post('/webpushtest', (req, res) => {
    try {
        setTimeout(async (_) => {
            // ちょっと遅延させて通知
            await webPush.sendNotification(
                req.body,
                JSON.stringify({
                    title: 'Web Push通知テスト',
                })
            );
        }, 5000);
    } catch (err) {
        console.log(err);
    }
});
app.post('/push_all', (req, res) => {
    webPush.sendNotification(
        req.body,
        JSON.stringify({
            title: 'TEST',
        })
    );
});

server.listen(3000, () => {});
