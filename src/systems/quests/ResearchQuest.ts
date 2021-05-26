import { sharedPlayer } from "config/Config";
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

export class ResearchQuest extends Quest {

    constructor(
        codeId: string,
        text: string,
        private readonly questManager: QuestManager,
        itemFactory: IItemFactory,
        abilityEvent: IAbilityEventHandler,
        researchAbilityId: number,
        private readonly researchId: number,
        rewards: [number, number][],
        giveToUnit: boolean = true
    ) {
        super(codeId, text, itemFactory, rewards, giveToUnit);

        abilityEvent.OnAbilitySuccess(researchAbilityId, (e: AbilityEvent) => this.OnAbilityUsed(e));
    }

    OnAbilityUsed(e: AbilityEvent): void {
        
        if (this.isActive == false) return;

        this.questManager.UpdateQuest(this);
    }

    IsCompleted() {
        return sharedPlayer.getTechCount(this.researchId, true) > 0;
    }

    ProgressDisplay(): string {
        return '';
        // return this.timesUsed + '/' + this.usesNeeded;
    }
}