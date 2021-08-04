import { Random } from "systems/random/Random";
import { ICavernNoiseProvider } from "../interfaces/ICavernNoiseProvider";

export class CaveHeightBuilder {

    
    constructor(
        private cavernNoise: ICavernNoiseProvider,
        
        // Settings
        public readonly xDensity: number = 1,
        public readonly yDensity: number = 1,

        public readonly stepOffset: number,
        public readonly random: Random,
    ) {
    }

    getCaveHeight(x: number, y: number): number {

        let height = this.cavernNoise.getDepthValue(x*this.xDensity, y*this.yDensity);
        // let height = this.cavernNoise.getDepthValue((x - minX1)/(maxX1-minX1), (y - minY1)/(maxY1-minY1));
        height = 1000 * height + 100;

        if (height < 64) {
            height = height ** 0.8 + 64;
        }

        return height;
    }

    isCaveWall(x: number, y: number) {
        let height = this.cavernNoise.getDepthValue(x*this.xDensity, y*this.yDensity);
        height = 1000 * height + 45;
        
        return height > 0;
    }

    buildCaveHeight(x: number, y: number): number {

        let height = this.cavernNoise.getDepthValue(x*this.xDensity, y*this.yDensity);
        // let height = this.cavernNoise.getDepthValue(x*this.xDensity, y*this.yDensity);
        height = 1000 * height + 45;

        if (height > 0) {
            // height = 300;
            CreateDestructableZ(FourCC('DTrc'), x + 32, y - 32, 100, this.random.next(0, 360), 1.22, this.random.nextInt(0, 6));
        }
        // if (height < 64) {
        //     height = - math.abs(height ** 0.8);
        // }

        TerrainDeformCrater(x, y, this.stepOffset, -64, 1, true);
        return 0.5;
    }
}