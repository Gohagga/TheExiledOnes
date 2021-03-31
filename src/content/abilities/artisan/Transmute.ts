import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { CraftingRecipe } from "systems/crafting/CraftingRecipe";
import { Material } from "systems/crafting/Material";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { ErrorService } from "systems/ui/ErrorService";
import { Item, Unit } from "w3ts/index";

export interface TransmuteAbility extends Wc3Ability {
    matAmount: number,
    material: Material,
}

export class Transmute extends AbilityBase {
    
    private readonly recipe: CraftingRecipe;
    
    constructor(
        data: TransmuteAbility,
        abilityEvent: IAbilityEventHandler,
        craftingManager: CraftingManager,
        private readonly errorService: ErrorService,
        private readonly resultItemType: number
    ) {
        super(data);
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));
        this.recipe = craftingManager.CreateRecipe([
            [data.matAmount, data.material]
        ]);
    }

    Execute(e: AbilityEvent): void {
        
        const caster = e.caster;
        let result = this.recipe.CraftTierInclusive(caster);

        if (result.successful == false) {
            this.errorService.DisplayError(caster.owner, `Missing: ${result.errors.join(', ')}`)
            return;
        }

        result.Consume();
        
        caster.addItem(new Item(this.resultItemType, 0, 0));
        
    }
    
    TooltipDescription = undefined;

}