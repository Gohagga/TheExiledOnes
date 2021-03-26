import { IHeightNoiseProvider } from "./IHeightNoiseProvider";

export interface ITreeNoiseProvider {

    getTreeValue(x: number, y: number): number;
}