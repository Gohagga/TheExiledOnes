import { Trigger } from "w3ts/index";
import { HeightBuilder } from "./HeightBuilder";




export const enum PathingType {

    HillSteepUnwalkable,
    DeepWater,
    Plains,
    Hills,
    SteepShore,
    ShallowWater
}

export class PathingBuilder {

    
    constructor(
        private heightBuilder: HeightBuilder,
        
        // Settings
        public readonly waterHeight: number = 0,
        public readonly xDensity: number = 1,
        public readonly yDensity: number = 1,

        public readonly stepOffset: number = 16,
    ) {
    }

    getPathing(x: number, y: number, height?: number): PathingType {

        height ||= this.heightBuilder.getHeight(x, y);
        let neutralHeight = this.heightBuilder.neutralHeight;
        
        if (height > 0) {
            let slope = 16;
            
            let nw = height;
            let ne = this.heightBuilder.getHeight(x + 16, y);
            let sw = this.heightBuilder.getHeight(x, y + 16);
            let se = this.heightBuilder.getHeight(x + 16, y + 16);

            if (height > neutralHeight + 500) {
                return PathingType.HillSteepUnwalkable;
            } else if (math.abs(nw - se) > slope ||
                math.abs(ne - sw) > slope
            ) {
                if (height > neutralHeight + 50)
                    return PathingType.HillSteepUnwalkable;
                else if (height < neutralHeight)
                    return PathingType.SteepShore;
                else
                    return PathingType.Hills;
            }
        }
        if (height > this.waterHeight) {
            return PathingType.Plains;
        } else if (height > this.waterHeight - 64) {
            return PathingType.ShallowWater;
        } else {
            return PathingType.DeepWater;
        }
    }

    buildPathing(x: number, y: number, pathing?: PathingType): number {

        let cost = 0;

        if (pathing) cost = 1;
        else cost = 1;

        pathing ||= this.getPathing(x, y);

        SetTerrainPathable(x, y, PATHING_TYPE_WALKABILITY, true);
        SetTerrainPathable(x, y, PATHING_TYPE_BUILDABILITY, true);

        switch (pathing) {
            case PathingType.HillSteepUnwalkable:
                SetTerrainPathable(x, y, PATHING_TYPE_WALKABILITY, false);
                SetTerrainPathable(x, y, PATHING_TYPE_BUILDABILITY, false);
                return cost;

            case PathingType.Plains:
                SetTerrainPathable(x, y, PATHING_TYPE_BUILDABILITY, true);
                SetTerrainPathable(x, y, PATHING_TYPE_WALKABILITY, true);
                return cost;

            case PathingType.Hills:
                SetTerrainPathable(x, y, PATHING_TYPE_BUILDABILITY, false);
                SetTerrainPathable(x, y, PATHING_TYPE_WALKABILITY, true);
                return cost;

            case PathingType.SteepShore:
            case PathingType.DeepWater:
                SetTerrainPathable(x, y, PATHING_TYPE_WALKABILITY, false);
                SetTerrainPathable(x, y, PATHING_TYPE_BUILDABILITY, false);
                SetTerrainPathable(x, y, PATHING_TYPE_FLOATABILITY, true);
                return cost;

            case PathingType.ShallowWater:
                SetTerrainPathable(x, y, PATHING_TYPE_WALKABILITY, true);
                SetTerrainPathable(x, y, PATHING_TYPE_BUILDABILITY, false);
                SetTerrainPathable(x, y, PATHING_TYPE_FLOATABILITY, true);
                return cost;
        }
    }
}