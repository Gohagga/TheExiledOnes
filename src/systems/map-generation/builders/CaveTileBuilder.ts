import { Random } from "systems/random/Random";
import { ICavernNoiseProvider } from "../interfaces/ICavernNoiseProvider";
import { IHeightNoiseProvider } from "../interfaces/IHeightNoiseProvider";
import { TerrainType } from "../MapGenerator";
import { CaveHeightBuilder } from "./CaveHeightBuilder";

export class CaveTileBuilder {

    
    constructor(
        private caveHeightBuilder: CaveHeightBuilder
    ) {
    }

    getCaveTile(x: number, y: number): number {

        let height = this.caveHeightBuilder.getCaveHeight(x, y);
        let value = height / 1100;

        if (value % 0.4 > 0.2 || value < 0.1) {
            return TerrainType.RoughDirt;
        } else
            return TerrainType.Dirt;
    }

    buildCaveTile(x: number, y: number): number {

        let tileType = this.getCaveTile(x, y);
        
        SetTerrainType(x, y, tileType, 0, 1, 1);
        SetTerrainPathable(x, y, PATHING_TYPE_BUILDABILITY, true);
        return 0;
    }
}