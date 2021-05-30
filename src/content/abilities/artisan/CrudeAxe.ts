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

export class CrudeAxe extends AbilityBase {
    

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
            [2, Material.Stone | Material.TierI | Material.TierII],
            [1, Material.Wood | Material.TierI | Material.TierII],
        ]);
    }

    Execute(e: AbilityEvent): boolean {
        
        Log.Info("Cast Create Crude Axe");
        let caster = e.caster;
        let result = this.recipe.CraftTierInclusive(caster);

        if (result.successful == false) {
            this.errorService.DisplayError(caster.owner, `Missing materials: ${result.errors.join(', ')}`)
            return false;
        }

        try {

            result.Consume();
            Log.Message("Lowest tier", result.lowestTier);

            let tiersExceptFirst = AllTiers & ~Material.TierI;
            print(tiersExceptFirst, result.lowestTier);
            if ((tiersExceptFirst & result.lowestTier) > 0) {
                Log.Message(`Crafted Tier 2 Axe.`);
                let it = new Item(FourCC('IT02'), 0, 0);
                if (!caster.addItem(it)) {
                    it.setPoint(caster.point);
                }
                caster.addExperience(this.experience, true);
            } else if (Material.TierI == (Material.TierI & result.lowestTier)) {
                Log.Message(`Crafted Tier 1 Axe.`);
                let it = new Item(FourCC('IT00'), 0, 0);
                caster.addExperience(this.experience, true);
                if (!caster.addItem(it)) {
                    it.setPoint(caster.point);
                }
            }
        } catch (ex) {
            Log.Error(ex);
        }

        return true;
    }
    
    TooltipDescription = (unit: Unit) =>
`Create an axe out of primitive materials. Axe is used to get Wood II from trees.

Creates up to Tier II Axe.

Materials
${this.recipe.costStringFormatted}`;

}