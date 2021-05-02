import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { Unit } from "w3ts/index";
import { AbilityBase } from "./AbilityBase";
import { Wc3Ability } from "./Wc3Ability";

export class BasicAbility extends AbilityBase {

    constructor(
        data: Wc3Ability,
        abilityEvent: IAbilityEventHandler
    ) {
        super(data);

        if (data.tooltip) {
            let tooltip = data.tooltip;
            this.TooltipDescription = () => tooltip;
        }

        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));
    }

    Execute(e: AbilityEvent): void {
        e.caster.addExperience(this.experience, true);
    }

    TooltipDescription?: (unit: Unit) => string;
}