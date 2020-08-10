import PacketHandler from './managers/PacketHandler';
import { ErrorPacket } from '../common/network/ServerPackets';
import ClientError from './util/ClientError';
import Pair from '../common/utils/Pair';
import ServerPlayer from './models/ServerPlayer';
import Room from '../common/models/Room';
import ServerRoom from './models/ServerRoom';

export default class GameManager {
    public packetHandler: PacketHandler;

    public rooms: ServerRoom[] = [];
    public players: Map<string, ServerPlayer>;

    private static PLAYER_TIMEOUT = 2 * 60 * 1000;

    constructor(serverIO: SocketIO.Server) {
        this.packetHandler = new PacketHandler(this);
        this.players = new Map();
        setInterval(this.tick.bind(this), 15000);
    }

    /**
     * Called every 15 seconds. Currently only used for removing inactive games.
     */
    private tick() {
        this.removeInactiveGames();
    }

    /**
     * This is called every 15 seconds to check if there are inactive players.
     * Players get disconnected after 5 minutes (might change later).
     */
    private removeInactiveGames() {
        let removeRooms: ServerRoom[] = [];
        let currentTime: number = new Date().getTime();


        this.players.forEach((player, key) => {
            // If the player is still connected we update the users' lastActive time
            if (player.socket?.connected) {
                player.lastActive = currentTime
            }
        })

        // Go over all rooms, if the lastActive on both users are over 2 minutes we remove the game
        this.rooms.forEach(room => {
            if (
                room.player1.lastActive < currentTime - GameManager.PLAYER_TIMEOUT &&
                room.player2.lastActive < currentTime - GameManager.PLAYER_TIMEOUT
            ) {
                removeRooms.push(room);
            }
        });

        removeRooms.forEach(room => {
            console.info(`Removed '${room.id}' due to inactivity of both users`);

            // Disconnect both players to clean up open sockets
            room.player1.socket.disconnect();
            room.player2.socket.disconnect();

            // Remove it from the list of games
            this.rooms.splice(this.rooms.findIndex(item => item.id == room.id ), 1);
        })
    }

    /**
     * This will be called when we receive a packet. If it's a socketChange packet we handle
     * it here accordingly, otherwise we pass it on to the PacketHandler
     * @param socket the socket we received the packet on
     * @param packet the packet we received.
     */
    onPacket(socket: SocketIO.Socket, packet: any) {
        try {
            if (packet == undefined || !('type' in packet)) {
                throw new ClientError('Invalid packet sent');
            }
            // The socketChange packet will happen when we create a new socket while we still
            // have an old ID in our cookie. This is so a person can reload the page without
            // getting kicked out of the game. So I hope.
            if (packet.type === 'socketChange') {
                let player = this.players.get(packet.oldId);
                // This automatically makes it fail-safe, if the user doesn't exist, we ignore it.
                if (player !== undefined) {
                    player.socket.disconnect(true); // Close previous socket
                    player.socketId = socket.id; // Update the id
                    player.socket = socket; // Update the socket
                    this.players.delete(packet.oldId); // delete the user from the old id
                    this.players.set(socket.id, player); // Set the user to the new id
                    console.info(`Succesfully changed Socket ID from '${packet.oldId}' to '${socket.id}'`);
                    // Send an update state so the user is back up to speed on where it was.
                    player.room.sendUpdate();
                }
                return;
            }
            
            // We get the user
            let player = this.players.get(socket.id);
            if (player === undefined) {
                // If we can't find a user, we send an error
                throw Error('You\'re not yet in a game!.');
            }

            // If we found a user we handle it in the packetHandler
            this.packetHandler.incomingPacket(player, packet);
        
        } catch (e) {
            // If the error is of type ClientError we just want to know the client about it
            // This is because we use ClientError explicitly if it is a known and deliberate error.
            if ('name' in e && e.name == 'ClientError') {
                socket.emit('errorPacket', new ErrorPacket(e.message));
                return;
            }
            
            // It is not of type ClientError, there might be something else going on. Let's throw it in console.
            console.warn('Malformed packet received: '+ e?.message, e);
            socket.emit('errorPacket', new ErrorPacket('An unknown error ocurred. If the error persists first try reloading, then try opening this page in a new tab.'));
            
        }
    }

    createRoom(player: ServerPlayer) {
        // TODO
    }

    /**
     * This is called when a connection get disconnected
     * 
     * @param socket the disconnecting socket 
     */
    onDisconnect(socket: SocketIO.Socket) {
        let user = this.players.get(socket.id);
        if (user == undefined) return;

        if (process.env.DEBUG)
            console.debug(`User '${user.socketId}' disconnected. After 2 mins he gets removed.`);
    }
}