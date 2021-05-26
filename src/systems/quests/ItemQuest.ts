import { Log } from "Log";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { CraftingRecipe } from "systems/crafting/CraftingRecipe";
import { Material } from "systems/crafting/Material";
import { IItemFactory } from "systems/items/IItemFactory";
import { Item, Trigger, Unit } from "w3ts/index";
import { Quest } from "./Quest";
import { QuestManager } from "./QuestManager";

export class ItemQuest extends Quest {

    private collectedItems: Set<number> = new Set<number>();
    private recipe: CraftingRecipe;

    constructor(
        codeId: string,
        text: string,
        private readonly questManager: QuestManager,
        private readonly craftingManager: CraftingManager,
        itemFactory: IItemFactory,
        itemMaterial: [number, ...(Material | number)[]][],
        private readonly itemAmount: number,
        rewards: [number, number][],
        giveToUnit: boolean = true,
    ) {
        super(codeId, text, itemFactory, rewards, giveToUnit);

        this.recipe = craftingManager.CreateRecipe(itemMaterial);

        let itemPickupTrg = new Trigger();
        itemPickupTrg.registerAnyUnitEvent(EVENT_PLAYER_UNIT_PICKUP_ITEM);
        itemPickupTrg.addAction(() => this.OnPickup());
    }

    OnPickup(): void {

        Log.Debug("is active", this.isActive)
        if (this.isActive == false) return;
        
        let item = Item.fromEvent();
        Log.Debug("itemtype", GetObjectName(item.typeId));

        // if (item.typeId != this.itemTypeId) return;
        // if (this.craftingManager.CheckItem(item, this.itemMaterial) == false) return;
        let caster = Unit.fromEvent();
        let result = this.recipe.CraftTierInclusive(caster, [item]);
        if (result.successful == false) return;

        Log.Debug("has item", this.collectedItems.has(item.id));

        if (this.collectedItems.has(item.id))
            return;
        
            Log.Debug(4)

        this.collectedItems.add(item.id);
        this.questManager.UpdateQuest(this);
        Log.Debug(5)

    }

    IsCompleted() {
        return this.collectedItems.size >= this.itemAmount;
    }

    ProgressDisplay(): string {
        return this.collectedItems.size + '/' + this.itemAmount;
    }
}