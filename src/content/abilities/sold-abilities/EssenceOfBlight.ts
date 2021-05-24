import { AbilityBase } from "systems/abilities/AbilityBase";
import { BasicAbility } from "systems/abilities/BasicAbility";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { CraftingRecipe } from "systems/crafting/CraftingRecipe";
import { Material } from "systems/crafting/Material";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { ErrorService } from "systems/ui/ErrorService";
import { Item, Trigger, Unit } from "w3ts/index";

export interface SoldWc3Ability extends Wc3Ability {
    soldItemTypeId: number
    cost: [number, ...(Material | number)[]][];
}

export class EssenceOfBlight extends AbilityBase {
    
    private costRecipe: CraftingRecipe;
    private soldItemTypeId: number;

    constructor(
        data: SoldWc3Ability,
        craftingManager: CraftingManager,
        private errorService: ErrorService,
    ) {
        super(data);
        
        this.costRecipe = craftingManager.CreateRecipe(data.cost);
        this.soldItemTypeId = data.soldItemTypeId;

        let sellTrg = new Trigger();
        sellTrg.registerAnyUnitEvent(EVENT_PLAYER_UNIT_PICKUP_ITEM);
        sellTrg.addAction(() => this.OnBuy());
    }

    OnBuy(): void {
        
        let sold = Item.fromEvent();
        if (sold.typeId != this.soldItemTypeId) return;
        sold.destroy();

        let buyer = Unit.fromEvent();

        let result = this.costRecipe.CraftTierInclusive(buyer);
        if (result.successful == false) {
            this.errorService.DisplayError(buyer.owner, `Missing: ${result.errors.join(', ')}`);
            return;
        }

        let currentLevel = buyer.getAbilityLevel(this.id);
        if (currentLevel == 0) {
            buyer.addAbility(this.id);
        }
        
        buyer.setAbilityLevel(this.id, currentLevel + 1);

        // If the level was not increased (max) don't consume items
        if (buyer.getAbilityLevel(this.id) == currentLevel)
            return;
        
        result.Consume();
    }

    TooltipDescription?: ((unit: Unit) => string) | undefined = undefined;
}