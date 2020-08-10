import socketIO from 'socket.io';
import GameManager from './GameManager';
import express from 'express';
import path from 'path';
import http from 'http';
import https from 'https';
import fs from 'fs';
import yargs from 'yargs';
import { ClientPacketType } from '../common/network/ClientPackets';
require('dotenv').config({ path: __dirname+'/../../.env' });


const MONGODB_URL = process.env.MONGODB_URL;
const MONGODB_DB = process.env.MONGODB_DB;
const WEB_PORT = process.env.WEB_PORT;
const SERVER_PORT = process.env.SERVER_PORT;
const DEBUG = process.env.DEBUG == "true";
const HTTPS = process.env.HTTPS == "true";

const argv = yargs
    .option('key', {
        alias: 'k',
        description: 'The SSL key file',
        type: 'string',
    })
    .option('cert', {
        alias: 'c',
        description: 'The SSL cert file',
        type: 'string',
    })
    .argv;


var httpServer: http.Server;
var ioServer: SocketIO.Server;
if (!DEBUG) {
    var expressServer = express();
    expressServer.use(express.static(path.join(__dirname, '/../client')));
    if (HTTPS) {
        httpServer = https.createServer({
            key: fs.readFileSync(argv.key),
            cert: fs.readFileSync(argv.cert),
        },expressServer);
    } else {
        httpServer = http.createServer(expressServer);
    }

    ioServer = socketIO(httpServer);
} else {
    ioServer = socketIO();
}

const gameManager = new GameManager(ioServer);

ioServer.on('connection', client => {
    client.on('message', data => {
        if (DEBUG) {
            console.debug("Packet received:", data);
        }
        gameManager.onPacket(client, data as ClientPacketType);
        });

    client.on('disconnect', () => { 
        gameManager.onDisconnect(client);
        });
});

if (!DEBUG)
    httpServer.listen(SERVER_PORT, () => console.log("Server running in production"));
else {
    ioServer.listen(SERVER_PORT);
    console.log("Server running in development");
}


    
// process.on('SIGTERM', shutDown);
// process.on('SIGINT', shutDown)

// function shutDown() {
//     console.warn("!!! SERVER CLOSED !!!");
//     ioServer?.close(() => {
//         process.exit();
//     });
// }