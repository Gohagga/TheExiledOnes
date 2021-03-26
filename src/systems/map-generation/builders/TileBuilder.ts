import { IMoistureNoiseProvider } from "../interfaces/IMoistureNoiseProvider";
import { TerrainType } from "../MapGenerator";
import { HeightBuilder } from "./HeightBuilder";
import { PathingBuilder, PathingType } from "./PathingBuilder";

export class TileBuilder {

    
    constructor(
        private readonly heightBuilder: HeightBuilder,
        private readonly pathingBuilder: PathingBuilder,
        private readonly moistureNoise: IMoistureNoiseProvider,
        
        // Settings
        public readonly neutralHeight: number = 0,
        public readonly xDensity: number = 1,
        public readonly yDensity: number = 1,

        // x /= 2784;
        // y /= 3008;

        public readonly stepOffset: number = 16,
    ) {
        
    }

    getTileType(x: number, y: number, pathing?: PathingType, height?: number): TerrainType {

        pathing ||= this.pathingBuilder.getPathing(x, y);

        switch (pathing) {
            case PathingType.HillSteepUnwalkable:
                return TerrainType.Rock;

            case PathingType.Plains:
                let moisture = this.moistureNoise.getValue(x / 2784, y / 3008);
                if (moisture >= 0.55) {
                    return TerrainType.ThickGrass;
                }
                else if (moisture > 0.3)
                    return TerrainType.Grass;
                else if (moisture % 0.12 > 0.06)
                    return TerrainType.ThinGrass;
                else
                    return TerrainType.Dirt;

            case PathingType.Hills:
                if (height || this.heightBuilder.getHeight(x, y) > 150)
                    return TerrainType.Rock;
                else
                    return TerrainType.Dirt;

            case PathingType.ShallowWater:
                return TerrainType.Dirt;

            case PathingType.DeepWater:
                return TerrainType.Dirt;

            case PathingType.SteepShore:
                return TerrainType.Rock;
        }
    }

    buildTerrainTile(x: number, y: number, tileType?: TerrainType): number {

        if (tileType) {
            SetTerrainType(x, y, tileType, 0, 1, 0);
            return 0.5;
        }

        SetTerrainType(x, y, this.getTileType(x, y), 0, 1, 0);
        return 1;
    }
}