import { Random } from "systems/random/Random";
import { IHeightNoiseProvider } from "../interfaces/IHeightNoiseProvider";
import { Simplex } from "../procedural/Simplex";

export class HeightNoiseProvider implements IHeightNoiseProvider {

    private gen1: Simplex;
    private gen2: Simplex;
    private gen3: Simplex;

    private readonly div1 = 0.05;
    private readonly div2 = 0.1;
    private readonly div3 = 0.125;
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

    constructor(random: Random) {
        this.gen1 = new Simplex(random);
        this.gen2 = new Simplex(random);
        this.gen3 = new Simplex(random);
    }

    getHeightValue(x: number, y: number): number {
        let elevation = 
            this.div1 * (this.gen1.getValueAt(x * 1, y * 1) * this.focus + this.offset) + 
            this.div2 * (this.gen2.getValueAt(x * 2, y * 2) * this.focus + this.offset) +
            this.div3 * (this.gen3.getValueAt(x * 4, y * 4) * this.focus + this.offset);
            
        elevation = elevation / (this.div1 + this.div2 + this.div3);
        // print("BEFORE: ", elevation);
        let sign = elevation / math.abs(elevation);
        elevation **= this.exponent;
        elevation = math.abs(elevation) * sign;

        elevation /= this.amp;

        return elevation;
    }
}