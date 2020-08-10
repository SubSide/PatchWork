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
        player: ServerPlayer,
        public id: string
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

    sendUpdate() {
        this.sendAllPlayers(new RoomStatePacket(this.getTransmitData()));
    }

    sendAllPlayers(serverPacket: ServerPacket) {
        this.player1.sendPacket(serverPacket);
        this.player2.sendPacket(serverPacket);
    }

    getTransmitData(): Game {
        return {
            id: this.id,
            inviteId: this.inviteId,
            player1: this.player1.getTransmitData(),
            player2: this.player2.getTransmitData()
        }
    }

    start() {
        // TODO do stuff
    }
}