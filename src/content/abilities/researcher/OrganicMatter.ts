import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { CraftingRecipe } from "systems/crafting/CraftingRecipe";
import { CraftingResult } from "systems/crafting/CraftingResult";
import { Material } from "systems/crafting/Material";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { IItemFactory } from "systems/items/IItemFactory";
import { ErrorService } from "systems/ui/ErrorService";
import { Destructable, Item, Rectangle, Timer, Trigger, Unit } from "w3ts/index";

export interface OrganicMatterAbility extends Wc3Ability {
    resultItemTypeId: number,
    recipe1: [number, ...(Material | number)[]][],
    recipe2: [number, ...(Material | number)[]][],
}

export class OrganicMatter extends AbilityBase {
    
    private resultItemTypeId: number;
    private recipe1: CraftingRecipe;
    private recipe2: CraftingRecipe;
    private readonly tooltip: string;
    
    constructor(
        data: OrganicMatterAbility,
        abilityEvent: IAbilityEventHandler,
        craftingManager: CraftingManager,
        private readonly errorService: ErrorService,
        private readonly itemFactory: IItemFactory,
    ) {
        super(data);
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));

        this.resultItemTypeId = data.resultItemTypeId;
        this.recipe1 = craftingManager.CreateRecipe(data.recipe1);
        this.recipe2 = craftingManager.CreateRecipe(data.recipe2);
        this.tooltip = data.tooltip || '';
    }

    Execute(e: AbilityEvent): void {
        
        Log.Info("Cast Organic Matter.");
        let caster = e.caster;
        let result: CraftingResult;
        
        let result1 = this.recipe1.CraftTierInclusive(caster);
        result = result1;

        // If first recipe is not successful, try the second one.
        if (result1.successful == false) {

            let result2 = this.recipe2.CraftTierInclusive(caster);
            if (result2.successful == false) {

                // Both recipes were not successful.
                this.errorService.DisplayError(caster.owner, `Missing: ${result1.errors.join(', ')} or ${result2.errors.join(', ')}`);
                return;
            }

            // Second recipe is successful.
            result = result2;
        }

        result.Consume();

        let item = this.itemFactory.CreateItemByType(this.resultItemTypeId);
        if (!caster.addItem(item))
            item.setPoint(caster.point);

        caster.addExperience(this.experience, true);
    }

    TooltipDescription = (unit: Unit) =>
`${this.tooltip}

Materials
${this.recipe1.costStringFormatted}
or
${this.recipe2.costStringFormatted}`;

}