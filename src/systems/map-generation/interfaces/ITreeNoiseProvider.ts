import { IHeightNoiseProvider } from "./IHeightNoiseProvider";

export interface ITreeNoiseProvider {

    getTreeValue(x: number, y: number, terrainHeight: number): { x: number, y: number, type: number };
}