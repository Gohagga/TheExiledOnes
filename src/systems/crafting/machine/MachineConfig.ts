import { Material } from "../Material";

export interface MachineConfig {
    workEffectPosition?: { x: number, y: number, z: number },
    workEffectPath: string,
}

export interface RecipeMachineConfig {
    workEffectPosition?: { x: number, y: number, z: number },
    workEffectPath: string,
    recipes: {
        trainId: number | string,
        resultId: number | string,
        materials: [number, Material][]
    }[]
}