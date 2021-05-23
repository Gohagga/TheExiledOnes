import { Unit } from "w3ts/index";
import { IQuest } from "./IQuest";

export class Quest implements IQuest {
    
    codeId: string;
    text: string = "Default Quest text";

    constructor(
        codeId: string,
        text: string,
    ) {
        this.codeId = codeId;
        this.text = text;
    }

    isActive: boolean = false;
    
    ClaimReward(unit: Unit): void {
        print("Reward claimed");
    }
    
    IsCompleted() {
        return true;
    }

    ProgressDisplay() {
        return "1/1";
    }
}