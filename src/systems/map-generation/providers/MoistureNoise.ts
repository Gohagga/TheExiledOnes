import { Random } from "systems/random/Random";
import { IHeightNoiseProvider } from "../interfaces/IHeightNoiseProvider";
import { IMoistureNoiseProvider } from "../interfaces/IMoistureNoiseProvider";
import { Simplex } from "../procedural/Simplex";

export class MoistureNoiseProvider implements IMoistureNoiseProvider {

    private gen1: Simplex;
    private gen2: Simplex;
    private gen3: Simplex;

    private readonly div1 = 0.05;
    private readonly div2 = 0.1;
    private readonly div3 = 0.125;

    // Makes peaks and lows even taller/deeper and irons out everything between -1 and 1
    private readonly exponent = 2.1;
    // Everything over 1 is considered a peak, everything below is a valley/plain
    private readonly topBound = 1.76;
    // Everything below -1 is water/hole, everything above is valley/plain
    private readonly lowBound = -1.12;
    
    private readonly invertExponent = 1 / this.exponent;
    private readonly focus = 0.5 * (this.topBound - this.lowBound) / 0.707;
    private readonly offset = 0.5 * (this.topBound - this.lowBound) + this.lowBound;
    private readonly amp = this.topBound ** this.invertExponent;

    constructor(random: Random) {
        this.gen1 = new Simplex(random);
        this.gen2 = new Simplex(random);
        this.gen3 = new Simplex(random);
    }

    private readonly freq1: number = 2 * 1.5;
    private readonly freq2: number = 3 * 1.5;
    private readonly freq3: number = 2.5 * 1.5;

    getValue(x: number, y: number): number {
        let value = 
            this.div1 * (this.gen1.getValueAt(x * this.freq1, y * this.freq1) * this.focus + this.offset) + 
            this.div2 * (this.gen2.getValueAt(x * this.freq2, y * this.freq2) * this.focus + this.offset) +
            this.div3 * (this.gen3.getValueAt(x * this.freq3, y * this.freq3) * this.focus + this.offset);
            
        value = value / (this.div1 + this.div2 + this.div3);
        // print("BEFORE: ", elevation);
        let sign = value / math.abs(value);
        value **= this.invertExponent;
        value = math.abs(value) * sign;

        value /= this.amp;

        return value;
    }
}