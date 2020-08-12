import Game from '../../common/models/Room';
import ServerPlayer from './ServerPlayer';
import ClientError from '../util/ClientError';
import Transmissible from '../../common/network/Transmissible';
import { ServerPacket, RoomStatePacket } from '../../common/network/ServerPackets';
import { v4 as UUID } from 'uuid';

export default class ServerRoom implements Transmissible<Game> {
    public inviteId: string = Buffer.from(UUID()).toString('base64');
    player1: ServerPlayer;
    player2: ServerPlayer = null;

    constructor(
        player: ServerPlayer
    ) {
        this.player1 = player;
    };

    public join(player: ServerPlayer, inviteId: string) {
        if (this.inviteId == null || this.inviteId != inviteId || this.player2 == null) {
            throw new ClientError("Invalid inviteId");
        }

        this.player2 = player;

        // TODO do stuff
    }


    sendUpdate(player: ServerPlayer) {
        if (this.player1 == player || this.player2 == player) {
            player.sendPacket(new RoomStatePacket(this.player1 == player, this.getTransmitData()));
        }
    }

    updateAllPlayers() {
        if (this.player1 != null) this.sendUpdate(this.player1);
        if (this.player2 != null) this.sendUpdate(this.player2);
    }

    getTransmitData(): Game {
        return {
            inviteId: this.inviteId,
            player1: this.player1.getTransmitData(),
            player2: this.player2?.getTransmitData()
        }
    }

    start() {
        // TODO do stuff
    }
}