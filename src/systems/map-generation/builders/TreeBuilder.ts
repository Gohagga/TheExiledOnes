import { Random } from "systems/random/Random";
import { IMoistureNoiseProvider } from "../interfaces/IMoistureNoiseProvider";
import { ITreeNoiseProvider } from "../interfaces/ITreeNoiseProvider";
import { TerrainType } from "../MapGenerator";
import { HeightBuilder } from "./HeightBuilder";
import { PathingBuilder, PathingType } from "./PathingBuilder";

export type Tree = {
    x: number,
    y: number,
    type: number,
    scale: number,
    facing: number,
    variation: number
}

export class TreeBuilder {

    constructor(
        private readonly heightBuilder: HeightBuilder,
        private readonly pathingBuilder: PathingBuilder,
        private readonly treeNoise: ITreeNoiseProvider,
        public readonly xDensity: number = 1,
        public readonly yDensity: number = 1,
        private readonly random: Random,
    ) {
        
    }

    getTree(x: number, y: number, pathing?: PathingType, height?: number): Tree | null {

        pathing ||= this.pathingBuilder.getPathing(x, y);

        let heightFromGround = (height || this.heightBuilder.getHeight(x, y)) - this.heightBuilder.neutralHeight;
        if (heightFromGround > 40) return null;

        switch (pathing) {
            case PathingType.HillSteepUnwalkable:
            case PathingType.ShallowWater:
            case PathingType.DeepWater:
            case PathingType.SteepShore:
                return null;

            case PathingType.Hills:
            case PathingType.Plains:

                let val = this.treeNoise.getTreeValue(x * this.xDensity, y * this.yDensity);
                if (val > 0 && this.random.next() <= val * 0.5) {

                    return {
                        x: this.random.nextInt(-32, 32) + x,
                        y: this.random.nextInt(-32, 32) + y,
                        type: FourCC('LTlt'),
                        facing: math.random(0, 360),
                        scale: this.random.next(0.8, 1.3),
                        variation: this.random.nextInt(0, 10),
                    }
                }
                return null;
        }
    }

    buildTreeOrDont(x: number, y: number, pathing?: PathingType, height?: number): number {

        let treeOrNot = this.getTree(x, y, pathing, height);

        if (treeOrNot) {
            CreateDestructable(treeOrNot.type, treeOrNot.x, treeOrNot.y, treeOrNot.facing, treeOrNot.scale, treeOrNot.variation);
            return 0.6;
        }

        return 0;
    }
}