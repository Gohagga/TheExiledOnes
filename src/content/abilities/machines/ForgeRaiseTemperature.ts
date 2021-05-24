import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3ToggleAbility } from "systems/abilities/Wc3Ability";
import { ForgeManager } from "systems/crafting/ForgeManager";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { OrderId } from "w3ts/globals/order";
import { Trigger, Unit } from "w3ts/index";

export class ForgeRaiseTemperature extends AbilityBase {
    
    constructor(
        data: Wc3ToggleAbility,
        abilityEvent: IAbilityEventHandler,
        private readonly forgeManager: ForgeManager,
    ) {
        super(data);

        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.ToggledOn(e));

        let t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_ORDER);
        t.addAction(() => 
            GetIssuedOrderId() == OrderId.Unimmolation
            ? this.ToggledOff()
            : null);

        if (data.tooltipOn) BlzSetAbilityActivatedExtendedTooltip(this.id, data.tooltipOn, 0);
        if (data.nameOn) BlzSetAbilityActivatedTooltip(this.id, data.nameOn, 0);
    }
    
    ToggledOn(e: AbilityEvent): void {
        
        let caster = e.caster;
        Log.Info("Raise temp cast")
        this.forgeManager.TurnRaiseOn(caster);
    }

    ToggledOff(): void {

        let caster = Unit.fromEvent();
        Log.Info("Raise temp off")
        this.forgeManager.TurnRaiseOff(caster);
    }
    
    TooltipDescription = undefined;
}