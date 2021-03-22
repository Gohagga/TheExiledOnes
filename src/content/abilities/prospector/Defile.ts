import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { ErrorService } from "systems/ui/ErrorService";
import { Unit } from "w3ts/index";

export class Defile extends AbilityBase {
    
    constructor(
        data: Wc3Ability,
        abilityEvent: IAbilityEventHandler,
        private readonly error: ErrorService
    ) {
        super(data);
        abilityEvent.OnAbilityEffect(this.id, (e) => this.Execute(e));
    }

    Execute(e: AbilityEvent) {
        Log.Info("test to see if this works", this.name);

        this.error.DisplayError(e.caster.owner, "This is an error.");

        let caster = e.caster;
    }

    TooltipDescription = (unit: Unit) => "123";

}