import { ResourceItem } from "content/items/ResourceItem";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { ErrorService } from "systems/ui/ErrorService";
import { Unit } from "w3ts/index";
import { ToolAbilityBase } from "../../../systems/abilities/ToolAbilityBase";
export class Axe extends ToolAbilityBase {

    constructor(
        data: Wc3Ability,
        abilityEvent: IAbilityEventHandler,
        private readonly errorService: ErrorService,
    ) {
        super(data);
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));
    }

    Execute(e: AbilityEvent): void {
        
        let caster = e.caster;
        let level = e.abilityLevel;
        let target = e.targetDestructable;

        if (!target) return;

        // 15
        let dmg = 6.25 + (level - 1) * 2;

        switch (target.typeId) {
            case FourCC('LTlt'):
                caster.damageTarget(target.handle, dmg, true, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_NORMAL, WEAPON_TYPE_AXE_MEDIUM_CHOP);
        
                // If widget has died, do drops
                if (GetWidgetLife(target.handle) <= 0.405) {
                    
                    let drop = 1;
                    // if ((level) * 0.2)
        
                    let { x, y } = target;
                    for (let i = 0; i < drop; i++) {
                        CreateItem(ResourceItem.WoodII, x, y);
                        caster.addExperience(this.experience, true);
                    }
                }
                break;

            default:
                this.errorService.DisplayError(caster.owner, "Target must be a tree.");
                break;
        }
    }
    
    TooltipDescription?: ((unit: Unit) => string) | undefined;
}