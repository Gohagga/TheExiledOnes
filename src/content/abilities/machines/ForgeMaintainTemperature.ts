import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3ToggleAbility } from "systems/abilities/Wc3Ability";
import { ForgeManager } from "systems/crafting/ForgeManager";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { OrderId } from "w3ts/globals/order";
import { Trigger, Unit } from "w3ts/index";

export class ForgeMaintainTemperature extends AbilityBase {
    
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
            GetIssuedOrderId() == OrderId.Manashieldoff
            ? this.ToggledOff()
            : null);

        if (data.tooltipOn) BlzSetAbilityActivatedExtendedTooltip(this.id, data.tooltipOn, 0);
        if (data.nameOn) BlzSetAbilityActivatedTooltip(this.id, data.nameOn, 0);
    }
    
    ToggledOn(e: AbilityEvent): boolean {
        
        let caster = e.caster;
        this.forgeManager.TurnMaintainOn(caster);
        return true;
    }

    ToggledOff(): boolean {

        let caster = Unit.fromEvent();
        this.forgeManager.TurnMaintainOff(caster);
        return true;
    }
    
    TooltipDescription = undefined;
}