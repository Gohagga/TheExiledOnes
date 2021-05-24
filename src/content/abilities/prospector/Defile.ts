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

        let caster = e.caster;
        let owner = caster.owner;
        let point = e.targetPoint;

        let blight = IsPointBlighted(point.x, point.y) == false;
        let radius = 64 + 192 * math.random();
        SetBlight(owner.handle, point.x, point.y, radius, true);

        if (blight) {
            caster.mana += 5;
            caster.addExperience(this.experience, true);
        }
    }

    TooltipDescription = undefined;

}