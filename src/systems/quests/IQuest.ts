import { Unit } from "w3ts/index";

export interface IQuest {

    codeId: string;
    
    text: string;

    isActive: boolean;

    ClaimReward(unit: Unit): void;

    IsCompleted: () => boolean;

    ProgressDisplay: () => string;
}