import { IItemFactory } from "systems/items/IItemFactory";
import { Unit } from "w3ts/index";
import { IQuest } from "./IQuest";

export class Quest implements IQuest {
    
    codeId: string;
    text: string = "Default Quest text";

    constructor(
        codeId: string,
        text: string,
        protected readonly itemFactory: IItemFactory,
        protected readonly rewards: [number, number][],
        protected readonly giveToUnit: boolean = true
    ) {
        this.codeId = codeId;
        this.text = text;
    }

    isActive: boolean = false;
    
    ClaimReward(unit: Unit): void {
        for (let r of this.rewards) {
            for (let i = 0; i < r[0]; i++) {
                let item = this.itemFactory.CreateItemByType(r[1], unit.x, unit.y);
                if (this.giveToUnit)
                    unit.addItem(item)
            }
        }
    }
    
    IsCompleted() {
        return true;
    }

    ProgressDisplay() {
        return "1/1";
    }
}