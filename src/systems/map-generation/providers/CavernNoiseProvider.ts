import { Random } from "systems/random/Random";
import { ICavernNoiseProvider } from "../interfaces/ICavernNoiseProvider";
import { IHeightNoiseProvider } from "../interfaces/IHeightNoiseProvider";
import { Perlin } from "../procedural/Perlin";
import { Simplex } from "../procedural/Simplex";

export class CavernNoiseProvider implements ICavernNoiseProvider {

    private gen1: Simplex;
    private gen2: Simplex;
    private gen3: Simplex;
    private gen4: Simplex;

    private readonly div1 = 0;
    private readonly div2 = 0.15;
    private readonly div3 = 0.3;
    private readonly divLake = 0.1;

    // Makes peaks and lows even taller/deeper and irons out everything between -1 and 1
    private readonly exponent = 3.41;
    // Everything over 1 is considered a peak, everything below is a valley/plain
    private readonly topBound = 1.76;
    // Everything below -1 is water/hole, everything above is valley/plain
    private readonly lowBound = -1.12;

    private readonly focus = 0.5 * (this.topBound - this.lowBound) / 0.707;
    private readonly offset = 0.5 * (this.topBound - this.lowBound) + this.lowBound;
    private readonly amp = this.topBound ** this.exponent;

    constructor(
        private readonly random: Random
    ) {
        this.gen1 = new Simplex(random);
        this.gen2 = new Simplex(random);
        this.gen3 = new Simplex(random);
        this.gen4 = new Simplex(random);
    }

    getDepthValue(x: number, y: number): number {
        
        x *= 3;
        y *= 3;
        let elevation = 
            (this.gen1.getValueAt(x * 4, y * 4) + this.div1) * this.focus + this.offset - 
            (this.gen2.getValueAt(x * 4, y * 4) + this.div2) * this.focus + this.offset +
            (this.gen3.getValueAt(x * 8, y * 8) + this.div3) * this.focus + this.offset;
        
        elevation = elevation / 3;
        // // print("BEFORE: ", elevation);
        let sign = elevation / math.abs(elevation);
        elevation **= this.exponent;
        elevation = -math.abs(elevation) * sign;

        // elevation -= (this.gen4.getValueAt(x * 14, y * 14) * this.focus + this.offset);
        
        // elevation /= this.amp;

        return elevation;
    }
}