import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { CraftingRecipe } from "systems/crafting/CraftingRecipe";
import { AllTiers, Material } from "systems/crafting/Material";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { ErrorService } from "systems/ui/ErrorService";
import { Item, Unit } from "w3ts/index";

export class CrudePickaxe extends AbilityBase {
    

    private readonly recipe: CraftingRecipe;;

    constructor(
        data: Wc3Ability,
        abilityEvent: IAbilityEventHandler,
        craftingManager: CraftingManager,
        private readonly errorService: ErrorService,
    ) {
        super(data);
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));

        this.recipe = craftingManager.CreateRecipe([
            [3, Material.Stone | Material.TierI | Material.TierII],
            [1, Material.Wood | Material.TierI | Material.TierII],
        ]);
    }

    Execute(e: AbilityEvent): void {
        
        
        Log.Info("Cast Create Crude Pickaxe");
        let caster = e.caster;
        let result = this.recipe.CraftTierInclusive(caster);

        if (result.successful == false) {
            this.errorService.DisplayError(caster.owner, `Missing: ${result.errors.join(', ')}`)
            return;
        }

        try {

            result.Consume();
            Log.Message("Lowest tier", result.lowestTier);

            let tiersExceptFirst = AllTiers & ~Material.TierI;
            if ((tiersExceptFirst & result.lowestTier) > 0) {
                Log.Message(`Crafted Tier 2 Pickaxe.`);
                caster.addItem(new Item(FourCC('IT03'), 0, 0));
                caster.addExperience(this.experience, true);
            } else if (Material.TierI == (Material.TierI & result.lowestTier)) {
                Log.Message(`Crafted Tier 1 Pickaxe.`);
                caster.addItem(new Item(FourCC('IT01'), 0, 0));
                caster.addExperience(this.experience, true);
            }
        } catch (ex) {
            Log.Error(ex);
        }

    }
    
    TooltipDescription = (unit: Unit) =>
`Create an pickaxe out of primitive materials. Pickaxe is used to get Stone II from Stone Piles.

Creates up to Tier II Pickaxe.

Materials
${this.recipe.costStringFormatted}`;

}