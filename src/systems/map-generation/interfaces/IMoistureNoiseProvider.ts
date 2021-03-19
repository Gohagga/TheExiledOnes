import { IHeightNoiseProvider } from "./IHeightNoiseProvider";

export interface IMoistureNoiseProvider {

    getValue(x: number, y: number): number;
}