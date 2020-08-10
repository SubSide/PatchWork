import Room from "../models/Room";

export interface ServerPacket {
    type: string;
}

export class RoomStatePacket implements ServerPacket {
    type: 'roomState' = 'roomState';
    constructor(public room: Room) {}
}

export class ErrorPacket implements ServerPacket {
    type: 'errorPacket' = 'errorPacket';
    constructor(public error: string) {}
}