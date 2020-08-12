export default interface Tile {
    id: string;
    grid: boolean[];
    steps: number;
    cost: number;
    color: String;
}

export interface TilePlacement {
    id: string;
    tile: Tile;
    rotation: Rotation;
    posX: number;
    posY: number;
}

export enum Rotation {
    NORTH, EAST, SOUTH, WEST
}