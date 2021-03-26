import { IHeightNoiseProvider } from "../interfaces/IHeightNoiseProvider";

export class HeightBuilder {

    constructor(
        private heightNoise: IHeightNoiseProvider,
        
        // Settings
        public readonly neutralHeight: number = 0,
        public readonly xDensity: number = 1,
        public readonly yDensity: number = 1,

        public readonly stepOffset: number = 128,
    ) {
        
    }

    getHeight(x: number, y: number): number {

        let height = this.heightNoise.getHeightValue(x * this.xDensity, y * this.yDensity);
        height = 2750 * height + this.neutralHeight;

        return height;
    }

    buildDeformation(x: number, y: number, height?: number): number {

        height ||= this.getHeight(x, y);
        TerrainDeformCrater(x, y, this.stepOffset, -height, 1, true);
        return 0.5;
    }
}