import Player from "./Player";

export default interface Room {
    inviteId: string;
    player1?: Player;
    player2?: Player;
}