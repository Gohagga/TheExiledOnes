import { Random } from "systems/random/Random";
import { IHeightNoiseProvider } from "../interfaces/IHeightNoiseProvider";
import { ITreeNoiseProvider } from "../interfaces/ITreeNoiseProvider";
import { Simplex } from "../procedural/Simplex";

export class TreeNoiseProvider implements ITreeNoiseProvider {

    private gen1: Simplex;
    private gen2: Simplex;
    private gen3: Simplex;

    private readonly div1 = 0.6;
    private readonly div2 = 0.3;
    private readonly div3 = 0.5;
    private readonly divLake = 0.1;

    // Makes peaks and lows even taller/deeper and irons out everything between -1 and 1
    private readonly exponent = 3;
    // Everything over 1 is considered a peak, everything below is a valley/plain
    private readonly topBound = 3;
    // Everything below -1 is water/hole, everything above is valley/plain
    private readonly lowBound = -1;

    private readonly focus = 0.5 * (this.topBound - this.lowBound) / 0.707;
    private readonly offset = 0.5 * (this.topBound - this.lowBound) + this.lowBound;
    private readonly amp = this.topBound ** this.exponent;

    constructor(
        random: Random
    ) {
        this.gen1 = new Simplex(random);
        this.gen2 = new Simplex(random);
        this.gen3 = new Simplex(random);
    }

    getTreeValue(x: number, y: number): number {

        let tree = 
            this.div1 * (this.gen1.getValueAt(x * 2, y * 2) * this.focus + this.offset) + 
            this.div2 * (this.gen2.getValueAt(x * 4, y * 4) * this.focus + this.offset) +
            this.div3 * (this.gen3.getValueAt(x * 8, y * 8) * this.focus + this.offset);
            
        tree = tree / (this.div1 + this.div2 + this.div3);
        // let sign = tree / math.abs(tree);
        tree **= this.exponent;
        tree /= 3;

        return tree;
    }
}