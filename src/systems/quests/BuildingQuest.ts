import { Log } from "Log";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { CraftingRecipe } from "systems/crafting/CraftingRecipe";
import { Material } from "systems/crafting/Material";
import { IItemFactory } from "systems/items/IItemFactory";
import { Item, Trigger, Unit } from "w3ts/index";
import { Quest } from "./Quest";
import { QuestManager } from "./QuestManager";

export class BuildingQuest extends Quest {

    private completedBuildings: Set<number> = new Set<number>();

    constructor(
        codeId: string,
        text: string,
        private readonly questManager: QuestManager,
        itemFactory: IItemFactory,
        private readonly builtUnitId: number,
        private readonly buildingAmount: number,
        rewards: [number, number][],
        giveToUnit: boolean = true
    ) {
        super(codeId, text, itemFactory, rewards, giveToUnit);

        let enterTrig = new Trigger();
        enterTrig.registerAnyUnitEvent(EVENT_PLAYER_UNIT_CONSTRUCT_FINISH);
        enterTrig.addAction(() => this.OnUnitBuilt());
    }

    OnUnitBuilt(): void {

        
        Log.Debug("is active", this.isActive)
        if (this.isActive == false) return;
        
        let building = Unit.fromEvent();
        if (building.typeId != this.builtUnitId) return;
        
        Log.Debug("has item", this.completedBuildings.has(building.id));

        if (this.completedBuildings.has(building.id))
            return;
        
        this.completedBuildings.add(building.id);
        this.questManager.UpdateQuest(this);
        Log.Debug(5)

    }

    ClaimReward(unit: Unit): void {
        for (let r of this.rewards) {
            for (let i = 0; i < r[0]; i++) {
                let item = this.itemFactory.CreateItemByType(r[1]);
                if (!unit.addItem(item))
                    item.setPosition(unit.x, unit.y);
            }
        }
    }

    IsCompleted() {
        return this.completedBuildings.size >= this.buildingAmount;
    }

    ProgressDisplay(): string {
        if (this.buildingAmount == 1) return '';
        return this.completedBuildings.size + '/' + this.buildingAmount;
    }
}