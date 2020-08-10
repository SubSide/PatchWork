import Player from "./Player";

export default interface Game {
    id: string;
    inviteId: string;
    player1: Player;
    player2: Player;
}