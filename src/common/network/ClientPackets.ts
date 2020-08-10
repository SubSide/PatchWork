export type ClientPacketType =
    SocketChangePacket |
    CreateRoomPacket |
    RequestStateUpdatePacket |
    StartGamePacket |
    JoinWithInvitePacket


export interface ClientPacket {
    type: string;
}

export class SocketChangePacket implements ClientPacket {
    type: 'socketChange' = 'socketChange';
    constructor(public oldId: string) {}
}

export class CreateRoomPacket implements ClientPacket {
    type: 'createRoom' = 'createRoom';
    constructor() {}
}

export class RequestStateUpdatePacket implements ClientPacket {
    type: 'requestStateUpdate' = 'requestStateUpdate';
    constructor() {}
}

export class JoinWithInvitePacket implements ClientPacket {
    type: 'joinWithInvite' = 'joinWithInvite';
    constructor(public inviteId: string) {}
}

export class StartGamePacket implements ClientPacket {
    type: 'startGame' = 'startGame';
    constructor() {}
}