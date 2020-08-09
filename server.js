const createSocketServer = require('socket.io');
const http = require('http');
const { parse } = require('url');
const fs = require('fs');

const PORT = process.env.PORT || 8080;
const connectedUsersMap = {};

const httpServer = http.createServer((req, res) => {
    const url = parse(req.url);
    const path = url.path === '/' ? '/index.html' : url.path;

    const file$ = fs.createReadStream(__dirname + path);

    file$.pipe(res);
    file$.on('error', () => {
        res.statusCode = 404;
        res.end();
    });
});

const socketServer = createSocketServer(httpServer);
const messageHistory = [];

socketServer.on('connection', socket => {
    connectedUsersMap[socket.id] = socket;

    socket.emit('history', messageHistory);

    socket.on('message', message => {
        messageHistory.push(message);

        Object.keys(connectedUsersMap).forEach((connectedUser) => {
            if (connectedUsersMap[connectedUser] !== socket) {
                connectedUsersMap[connectedUser].emit('message', message);
            }
        });
    });

    socket.on('disconnect', () => {
        delete connectedUsersMap[socket.id];
    });
});

httpServer.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});
