import { Socket, Server } from 'socket.io';
import express from 'express';
import http from 'http';
import {
    leaveMatch,
    canLaunchMatch,
    findMatch,
    getFirstGame,
    havePlayerWinGame,
    playPlayerAction,
    startMatch,
} from './matchManagers';
import { config } from './config/constants';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' },
});

io.on('connection', (socket: Socket) => {
    console.log(`Player connected: ${socket.id}`);

    socket.on('joinQueue', playerName => {
        var playerId = socket.id;
        var match = findMatch(playerId, playerName);
        if (match === undefined)
            // player already in a queue
            return;
        console.log(`Add player ${playerId} into match : ${match.id}`);
        socket.emit('updateQueue', {
            count: match.nbPlayers,
            nb_player_per_match: config.NB_PLAYER_PER_MATCH,
        });
        if (canLaunchMatch(match.id)) {
            console.log(`Start match ${match.id}`);
            const initialGameState = startMatch(match.id);
            io.emit('matchFound', initialGameState); // TODO: don't send to every player connect
        }
    });

    socket.on('cancelQueue', () => {
        var playerId = socket.id;
        var rep = leaveMatch(playerId);
        if (rep.error || !rep.match) return;
        io.emit('updateQueue', {
            count: rep.match.nbPlayers,
            nb_player_per_match: config.NB_PLAYER_PER_MATCH,
        }); // TODO: don't send to every player connect
    });

    socket.on('requestGameState', () => {
        console.log(`Sending gameState to ${socket.id}`);
        const initialGameState = getFirstGame(socket.id);
        socket.emit('gameState', initialGameState);
    });

    socket.on('revealCell', ({ x, y }) => {
        console.log(`Received revealCell event from ${socket.id}: (${x}, ${y})`);
        const result = playPlayerAction(socket.id, x, y);
        socket.emit('gameUpdate', result);
    });

    socket.on('isGridValid', ({ cells }) => {
        console.log(`Received isGridValid event from ${socket.id}`);
        const result = havePlayerWinGame(socket.id, cells);
        socket.emit('gameStatus', result);
        if (result.win) io.emit('timerStart', { time: 0 }); // TODO: don't send to every player connect
    });

    socket.on('disconnect', () => {
        var playerId = socket.id;
        leaveMatch(playerId);
        console.log(`Player disconnected: ${socket.id}`);
    });
});

server.listen(3000, () => console.log('Server running on port 3000'));
