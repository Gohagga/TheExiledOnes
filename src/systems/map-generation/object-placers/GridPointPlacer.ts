import { Rectangle } from "w3ts/index";

export class GridPointPlacer {

    private tiles: number[] = [];

    private minX: number;
    private maxX: number;
    private minY: number;
    private maxY: number;
    private width: number;
    private height: number;
    private tileWidth: number;
    private tileHeight: number;

    constructor(
        private rect: Rectangle,
        private gridHeight: number,
        private gridWidth: number,
        private maxPerTile: number,
    ) {
        this.minX = rect.minX;
        this.maxX = rect.maxX;
        this.minY = rect.minY;
        this.maxY = rect.maxY;
        this.width = this.maxX - this.minX;
        this.height = this.maxY - this.minY;
        this.tileWidth = (this.maxX - this.minX) / gridWidth;
        this.tileHeight = (this.maxY - this.minY) / gridHeight;
    }

    placeObject(x: number, y: number): boolean {

        let iX = math.floor(((x - this.minX) / this.width) * this.gridWidth);
        let iY = math.floor(((y - this.minY) / this.height) * this.gridHeight);

        let index = iY * this.gridWidth + iX;

        // if (!this.tiles[index])
        //     // this.tiles[index] = [];
        if (!this.tiles[index]) {
            this.tiles[index] = 0;
        }
        if (this.tiles[index] >= this.maxPerTile) {
            return false;
        }

        this.tiles[index]++
        return true;
    }
}