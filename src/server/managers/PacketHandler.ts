import { ClientPacketType, CreateRoomPacket, RequestStateUpdatePacket,StartGamePacket, JoinWithInvitePacket } from "../../common/network/ClientPackets";
import GameManager from "../GameManager";
import ClientError from "../util/ClientError";
import ServerPlayer from "../models/ServerPlayer";

export default class PacketHandler {
    constructor(public gameManager: GameManager) {
    }

    incomingPacket(player: ServerPlayer, packet: ClientPacketType) {
        switch (packet.type) {
            case 'createRoom':
                this.handleCreateRoom(player, packet);
                break;
            case 'requestStateUpdate':
                this.requestStateUpdate(player, packet);
                break;
            case 'joinWithInvite':
                this.handleJoinByInvite(player, packet);
                break;
            case 'startGame':
                this.handleStartGame(player, packet);
                break;
        }
        
    }

    private handleCreateRoom(player: ServerPlayer, packet: CreateRoomPacket) {
        if (!player.canDo("createRoom", 1000)) {
            throw new ClientError("Wait a moment before create a room again.");
        }
        this.gameManager.createRoom(player);
    }

    private requestStateUpdate(player: ServerPlayer, packet: RequestStateUpdatePacket) {
        player.room.sendUpdate();
    }

    private handleJoinByInvite(player: ServerPlayer, packet: JoinWithInvitePacket) {
        if (!player.canDo("joinRoom", 2000)) {
            throw new ClientError("Wait a moment before joining another room.");
        }
        
        let room = this.gameManager.rooms.find(room => room.inviteId == packet.inviteId);
        
        if (room == null) {
            throw new ClientError('No room with this invite link exists.');
        }

        room.join(player, packet.inviteId);
    }

    private handleStartGame(player: ServerPlayer, startGamePacket: StartGamePacket) {
        if (!player.canDo("startGame", 2000)) {
            throw new ClientError("Wait a moment before trying this action again!");
        }

        // Update settings, we do this so if we change the settings and immediately press start
        // We get the latest settings for sure
        // We call updateSettings so we know for sure 
        player.room.start();
    }
}