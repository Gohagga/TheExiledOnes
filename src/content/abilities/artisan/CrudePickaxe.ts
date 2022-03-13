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
    

    private readonly recipe: CraftingRecipe;
    private readonly tooltip: string;

    constructor(
        data: Wc3Ability,
        abilityEvent: IAbilityEventHandler,
        craftingManager: CraftingManager,
        private readonly errorService: ErrorService,
    ) {
        super(data);
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));

        this.recipe = craftingManager.CreateRecipe([
            [3, Material.Stone | Material.TierII],
            [1, Material.Wood | Material.TierII],
        ]);

        this.tooltip = data.tooltip || '';
    }

    Execute(e: AbilityEvent): boolean {
        
        
        Log.Info("Cast Create Crude Pickaxe");
        let caster = e.caster;
        let result = this.recipe.CraftTierInclusive(caster);

        if (result.successful == false) {
            this.errorService.DisplayError(caster.owner, `Missing: ${result.errors.join(', ')}`)
            return false;
        }

        try {

            result.Consume();
            Log.Message("Lowest tier", result.lowestTier);

            let tiersExceptFirst = AllTiers & ~Material.TierI;
            if ((tiersExceptFirst & result.lowestTier) > 0) {
                Log.Message(`Crafted Tier 2 Pickaxe.`);
                let it = new Item(FourCC('IT03'), 0, 0);
                caster.addExperience(this.experience, true);
                if (!caster.addItem(it)) {
                    it.setPoint(caster.point);
                }
            } else if (Material.TierI == (Material.TierI & result.lowestTier)) {
                Log.Message(`Crafted Tier 1 Pickaxe.`);
                let it = new Item(FourCC('IT01'), 0, 0);
                caster.addExperience(this.experience, true);
                if (!caster.addItem(it)) {
                    it.setPoint(caster.point);
                }
            }
        } catch (ex: any) {
            Log.Error(ex);
        }
        
        return true;
    }

    TooltipDescription = (unit: Unit) =>
`${this.tooltip}

Materials
${this.recipe.costStringFormatted}`;

}