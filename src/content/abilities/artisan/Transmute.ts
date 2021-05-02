import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { CraftingRecipe } from "systems/crafting/CraftingRecipe";
import { Material } from "systems/crafting/Material";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { IItemFactory } from "systems/items/IItemFactory";
import { ErrorService } from "systems/ui/ErrorService";
import { Item, Unit } from "w3ts/index";

export interface TransmuteAbility extends Wc3Ability {
    matAmount: number,
    material: Material,
}

export class Transmute extends AbilityBase {
    
    private readonly recipe: CraftingRecipe;
    private readonly tooltip: string;
    private manacost = 0;
    
    constructor(
        data: TransmuteAbility,
        abilityEvent: IAbilityEventHandler,
        craftingManager: CraftingManager,
        private readonly itemFactory: IItemFactory,
        private readonly errorService: ErrorService,
        private readonly resultItemType: number
    ) {
        super(data);
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));
        this.recipe = craftingManager.CreateRecipe([
            [data.matAmount, data.material]
        ]);

        this.manacost = BlzGetAbilityManaCost(this.id, 0);

        this.tooltip = data.tooltip || '';
    }

    Execute(e: AbilityEvent): void {
        
        const caster = e.caster;
        let result = this.recipe.CraftTierInclusive(caster);

        if (result.successful == false) {
            this.errorService.DisplayError(caster.owner, `Missing: ${result.errors.join(', ')}`);
            caster.mana += this.manacost;
            return;
        }

        result.Consume();
        
        let item = this.itemFactory.CreateItemByType(this.resultItemType);
        if (!caster.addItem(item))
            item.setPoint(caster.point);

        caster.addExperience(this.experience, true);
        
    }
    
    TooltipDescription = (unit: Unit) =>
`${this.tooltip}

Materials
${this.recipe.costStringFormatted}`;

}