import { AbilityBase } from "systems/abilities/AbilityBase";
import { CraftingRecipe } from "systems/crafting/CraftingRecipe";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { Unit } from "w3ts/index";

export class MachineRecipeAbility extends AbilityBase {
    
    constructor(
        index: number,
        name: string,
        private tooltip: string,
        icon: string,
        private trainId: number,
        private recipe: CraftingRecipe,
        abilityEvent: IAbilityEventHandler
    ) {
        super({
            codeId: 'AR0' + string.format('%02d', index),
            name: name,
            tooltip: tooltip
        });

        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));
    }

    Execute(e: AbilityEvent): void {
        let caster = e.caster;
        caster.issueImmediateOrder(this.trainId);
    }

    TooltipDescription = (unit: Unit) => 
`${this.tooltip}

Materials
${this.recipe.costStringFormatted}`;

}