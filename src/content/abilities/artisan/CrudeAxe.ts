import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { CraftingRecipe } from "systems/crafting/CraftingRecipe";
import { Material } from "systems/crafting/Material";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { Unit } from "w3ts/index";

export class CrudeAxe extends AbilityBase {
    

    private readonly recipe: CraftingRecipe;
    private readonly cost: Material[] = [
        Material.Stone | Material.TierI,
        Material.Stone | Material.TierI,
        Material.Wood | Material.TierI,
        Material.Wood | Material.TierI,
    ];

    constructor(
        data: Wc3Ability,
        abilityEvent: IAbilityEventHandler,
        craftingManager: CraftingManager,
    ) {
        super(data);
        this.recipe = craftingManager.CreateRecipe(this.cost);
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e))
    }

    Execute(e: AbilityEvent): void {
        
        
        Log.Info("Cast Create Crude Axe");
        let caster = e.caster;
        let result = this.recipe.GetHighestTierMaterials(caster);

        if (!result) return;

        try {

            for (let item of result.itemsToConsume) {
                Log.Info(item.name, item.id);
                caster.removeItem(item);
            }
            Log.Info("Lowest tier", result.lowestTier);

            if (Material.TierII == (Material.TierII & result.lowestTier)) {
                Log.Info(`Crafted Tier 2 Axe.`);
            } else if (Material.TierI == (Material.TierI & result.lowestTier)) {
                Log.Info(`Crafted Tier 1 Axe.`);
            }
        } catch (ex) {
            Log.Error(ex);
        }

    }
    
    TooltipDescription?: ((unit: Unit) => string) | undefined;

}