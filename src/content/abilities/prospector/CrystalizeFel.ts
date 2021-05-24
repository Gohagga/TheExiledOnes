import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { ItemFactory } from "systems/items/ItemFactory";
import { ErrorService } from "systems/ui/ErrorService";
import { Unit } from "w3ts/index";

export class CrystalizeFel extends AbilityBase {
    
    constructor(
        data: Wc3Ability,
        abilityEvent: IAbilityEventHandler,
        private readonly error: ErrorService,
        private readonly itemFactory: ItemFactory,
    ) {
        super(data);
        abilityEvent.OnAbilityEffect(this.id, (e) => this.Execute(e));
    }

    Execute(e: AbilityEvent) {

        let caster = e.caster;
        let owner = caster.owner;
        let point = e.targetPoint;
        Log.Info("Has cast Crystalize fel");

        let item = this.itemFactory.CreateItemByType(FourCC('I003'), caster.x, caster.y);
        caster.addExperience(this.experience, true);
    }

    TooltipDescription = undefined;

}