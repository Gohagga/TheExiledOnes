import { Log, LogColor } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { CraftingRecipe } from "systems/crafting/CraftingRecipe";
import { CraftingResult } from "systems/crafting/CraftingResult";
import { ForgeManager } from "systems/crafting/ForgeManager";
import { Material } from "systems/crafting/Material";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { IItemFactory } from "systems/items/IItemFactory";
import { ErrorService } from "systems/ui/ErrorService";
import { Color, Item, Unit } from "w3ts/index";

export interface FelExtractionAbility extends Wc3Ability {
    materials: [number, Material][][],
    itemFel: Record<number, number>,
}

export class FelExtraction extends AbilityBase {
    
    private readonly recipes: CraftingRecipe[] = [];
    private readonly itemFelAmount: Record<number, number>;
    private readonly tooltip: string;
    private manacost = 0;
    
    constructor(
        data: FelExtractionAbility,
        abilityEvent: IAbilityEventHandler,
        craftingManager: CraftingManager,
        private readonly itemFactory: IItemFactory,
        private readonly errorService: ErrorService,
    ) {
        super(data);
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));

        for (let mats of data.materials) {
            this.recipes.push(craftingManager.CreateRecipe(mats));
        }
        this.itemFelAmount = data.itemFel;

        this.manacost = BlzGetAbilityManaCost(this.id, 0);

        this.tooltip = data.tooltip || '';
    }

    Execute(e: AbilityEvent): boolean {
        
        const caster = e.caster;
        
        Log.Info("Fel Extraction cast.")
        let result: CraftingResult | null = null;

        for (let recipe of this.recipes) {
            result = recipe.CraftTierInclusive(caster);
            if (result.successful) break;
        }

        if (!result || result.successful == false) {
            this.errorService.DisplayError(caster.owner, "No item valid for extraction.");
            caster.mana += this.manacost;
            return false;
        }

        let felAmount = 0;
        for (let item of result.itemsToConsume) {
            felAmount += this.itemFelAmount[item.typeId] || 0;
        }
        result.Consume();
        
        caster.mana += felAmount;
        caster.addExperience(felAmount * this.experience, true);

        return true;
    }
    
    TooltipDescription = (unit: Unit) =>
`${this.tooltip}`;

}