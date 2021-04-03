import { IMinimap } from "systems/minimap/IMinimap";
import { TerrainType } from "../MapGenerator";
import { HeightBuilder } from "./HeightBuilder";
import { PathingBuilder, PathingType } from "./PathingBuilder";
import { TileBuilder } from "./TileBuilder";

export class MinimapBuilder {

    
    constructor(
        private readonly minimap: IMinimap,
        private readonly heightBuilder: HeightBuilder,
        private readonly pathingBuilder: PathingBuilder,
        private readonly tileBuilder: TileBuilder,
    ) {

    }

    getMiniPixColor(x: number, y: number, tile?: TerrainType, pathing?: PathingType, height?: number): number {

        tile ||= this.tileBuilder.getTileType(x, y);
        
        pathing ||= this.pathingBuilder.getPathing(x, y);
        if (pathing == PathingType.DeepWater)
            return BlzConvertColor(255, 0, 157, 200);
        else if (pathing == PathingType.ShallowWater || pathing == PathingType.SteepShore)
            return BlzConvertColor(255, 0, 157, 225);

        switch (tile) {
            case TerrainType.Rock:
                height ||= this.heightBuilder.getHeight(x, y);
                if (height > this.heightBuilder.neutralHeight) {
        
                    if (height >= 160) {
                        let darkness = height / 700;
                        if (darkness < 0) darkness = 0.1;
                        else if (darkness > 1) darkness = 1;
        
                        let grey = math.floor(150 - 150*darkness);
                        return BlzConvertColor(255, 5+grey, grey, grey);
                    }
                    return BlzConvertColor(255, 145, 104, 60);

                } else if (height > 0) {
                    return BlzConvertColor(255, 166, 192, 137);

                } else {
                    return BlzConvertColor(255, 0, 157, 225);

                }

            case TerrainType.Dirt:
                return BlzConvertColor(255, 191, 148, 100);
            case TerrainType.RoughDirt:
                return BlzConvertColor(255, 153, 117, 77);
            case TerrainType.ThinGrass:
                return BlzConvertColor(255, 166, 192, 137);
            case TerrainType.Grass:
                return BlzConvertColor(255, 161, 185, 130);
            case TerrainType.ThickGrass:
                return BlzConvertColor(255, 151, 177, 125);
        }

        return BlzConvertColor(255, 145, 104, 60);
    }

    buildMiniPixRaw(col: number, row: number, mapX: number, mapY: number, miniPixColor?: number) {

        if (miniPixColor) {
            this.minimap.setMiniPixel(col, row, miniPixColor);
            return 1;
        }

        this.minimap.setMiniPixel(col, row, this.getMiniPixColor(mapX, mapY));
        return 2.0;
    }

    buildMiniPix(x: number, y: number, miniPixColor?: number): number {

        if (miniPixColor) {
            this.minimap.setPoint(x, y, miniPixColor);
            return 1;
        }

        this.minimap.setPoint(x, y, this.getMiniPixColor(x, y));
        return 3.0;
    }
}