import { Log } from "Log";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { CraftingRecipe } from "systems/crafting/CraftingRecipe";
import { Material } from "systems/crafting/Material";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { IItemFactory } from "systems/items/IItemFactory";
import { Item, Trigger, Unit } from "w3ts/index";
import { Quest } from "./Quest";
import { QuestManager } from "./QuestManager";

export class AbilityUsedQuest extends Quest {

    private timesUsed = 0;

    constructor(
        codeId: string,
        text: string,
        private readonly questManager: QuestManager,
        itemFactory: IItemFactory,
        abilityEvent: IAbilityEventHandler,
        private readonly abilityId: number,
        private readonly usesNeeded: number,
        rewards: [number, number][],
        giveToUnit: boolean = true
    ) {
        super(codeId, text, itemFactory, rewards, giveToUnit);

        abilityEvent.OnAbilitySuccess(abilityId, (e: AbilityEvent) => this.OnAbilityUsed(e));
    }

    OnAbilityUsed(e: AbilityEvent): void {
        
        if (this.isActive == false) return;

        this.timesUsed++;
        this.questManager.UpdateQuest(this);
    }

    IsCompleted() {
        return this.timesUsed >= this.usesNeeded;
    }

    ProgressDisplay(): string {
        return this.timesUsed + '/' + this.usesNeeded;
    }
}