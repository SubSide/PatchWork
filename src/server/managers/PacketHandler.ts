import { ClientPacketType, CreateRoomPacket, RequestStateUpdatePacket,StartGamePacket, JoinWithInvitePacket } from "../../common/network/ClientPackets";
import GameManager from "../GameManager";
import ClientError from "../util/ClientError";
import ServerPlayer from "../models/ServerPlayer";
import e from "express";
import { Socket } from "socket.io";
import ServerRoom from "../models/ServerRoom";

export default class PacketHandler {
    constructor(public gameManager: GameManager) {
    }

    incomingPacket(socket: Socket, player: ServerPlayer, packet: ClientPacketType) {

        if (player == null) {
            switch (packet.type) {
                case 'createRoom':
                    this.handleCreateRoom(packet, socket);
                    break;
                case 'joinWithInvite':
                    this.handleJoinByInvite(packet, socket);
                    break;
                default:
                    throw new ClientError("Malformed packet");
            }
        } else {
            switch (packet.type) {
                case 'startGame':
                    this.handleStartGame(player, packet);
                    break;
                case 'requestStateUpdate':
                    this.requestStateUpdate(player, packet);
                    break;
                default:
                    throw new ClientError("Malformed packet");
            }
        }        
    }

    private handleCreateRoom(packet: CreateRoomPacket, socket: Socket) {
        if (this.gameManager.players.get(socket.id) != null) {
            throw new ClientError("You're already in a game!");
        }

        let player = new ServerPlayer(socket.id, socket);
        this.gameManager.players.set(socket.id, player);

        let room = new ServerRoom(player);
        player.room = room;
        this.gameManager.rooms.push(room);

        room.updateAllPlayers();
    }

    private handleJoinByInvite(packet: JoinWithInvitePacket, socket: Socket) {
        if (this.gameManager.players.get(socket.id) != null) {
            throw new ClientError("You're already in a game!");
        }

        let room = this.gameManager.rooms.find(room => room.inviteId == packet.inviteId);
        
        if (room == null) {
            throw new ClientError('No room with this invite link exists.');
        }

        let player = new ServerPlayer(socket.id, socket);
        this.gameManager.players.set(socket.id, player);

        room.join(player, packet.inviteId);
        room.updateAllPlayers();
    }

    private requestStateUpdate(player: ServerPlayer, packet: RequestStateUpdatePacket) {
        player.sendUpdate();
    }

    private handleStartGame(player: ServerPlayer, startGamePacket: StartGamePacket) {
        if (!player.canDo("startGame", 2000)) {
            throw new ClientError("Wait a moment before trying this action again!");
        }

        player.room.start();
    }
}