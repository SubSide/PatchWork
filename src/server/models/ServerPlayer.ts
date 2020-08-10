import Player from '../../common/models/Player';
import ServerRoom from './ServerRoom';
import { ServerPacket } from '../../common/network/ServerPackets';
import Transmissible from '../../common/network/Transmissible';

export default class ServerPlayer implements Transmissible<Player> {
    public lastActive: number = 0;

    public points: number;
    private cooldowns: Map<string, number> = new Map();
    private grid: boolean[][];
    private has7x7: boolean = false

    constructor(
        public socketId: string,
        public socket: SocketIO.Socket,
        public room: ServerRoom,
    ) {
        this.points = 0;
    }

    canDo(text: string, cooldown: number) {
        if (!this.cooldowns.has(text)) {
            this.cooldowns.set(text, 0);
        }

        let currentCooldownTime = this.cooldowns.get(text);
        let currentTime = new Date().getTime();
        this.cooldowns.set(text, currentTime + cooldown);

        return currentCooldownTime < currentTime;
    }

    getTransmitData(): Player {
        return {
            points: this.points,
            grid: this.grid,
            has7x7: this.has7x7
        }
    }

    sendPacket(packet: ServerPacket) {
        this.socket.emit(packet.type, packet);
    }

}