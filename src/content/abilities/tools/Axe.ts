import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { Unit } from "w3ts/index";
export class Axe extends AbilityBase {

    constructor(
        data: Wc3Ability,
        abilityEvent: IAbilityEventHandler,
    ) {
        super(data);
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));
    }

    Execute(e: AbilityEvent): void {
        
        let caster = e.caster;
        let level = e.abilityLevel;
        let target = e.targetDestructable;

        // 15
        let dmg = 6.25 + (level - 1) * 2;
        caster.damageTarget(target.handle, dmg, true, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_NORMAL, WEAPON_TYPE_AXE_MEDIUM_CHOP);

        // If widget has died, do drops
        if (GetWidgetLife(target.handle) <= 0.405) {
            
            let drop = 1;
            // if ((level) * 0.2)

            let { x, y } = target;
            for (let i = 0; i < drop; i++) {
                CreateItem(FourCC('IM01'), x, y);
            }
        }
    }
    
    TooltipDescription?: ((unit: Unit) => string) | undefined;
}