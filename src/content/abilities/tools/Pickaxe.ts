import { ResourceItem } from "content/items/ResourceItem";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { OreType } from "systems/map-generation/object-placers/OrePlacer";
import { ErrorService } from "systems/ui/ErrorService";
import { Item, Unit } from "w3ts/index";
import { ToolAbility, ToolAbilityBase } from "../../../systems/abilities/ToolAbilityBase";

export class Pickaxe extends ToolAbilityBase {

    constructor(
        data: ToolAbility,
        abilityEvent: IAbilityEventHandler,
        private readonly errorService: ErrorService,
    ) {
        super(data);
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));
    }

    Execute(e: AbilityEvent): boolean {
        
        let caster = e.caster;
        let level = e.abilityLevel;
        let target = e.targetDestructable;
        if (!target) return false;
        
        let life = target.life;
        let totalDrops = 4;
        let intervalLife = target.maxLife / totalDrops;

        // 15
        let dmg = 30 + (level - 1) * 15;
        
        switch (target.typeId) {
            case OreType.StonePile:
                
                caster.damageTarget(target.handle, dmg, true, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_NORMAL, WEAPON_TYPE_AXE_MEDIUM_CHOP);
                let total = math.floor((target.maxLife - target.life) / intervalLife);
                let alreadyDropped = math.floor((target.maxLife - life) / intervalLife);
                let toDrop = total - alreadyDropped;
                
                let { x, y } = target;
                for (let i = 0; i < toDrop; i++) {
                    let it = new Item(ResourceItem.StoneII, x, y);
                    caster.addItem(it);
                    caster.addExperience(this.experience, true);
                }
                break;
            default:
                this.errorService.DisplayError(caster.owner, "Target must be debris.");
                break;
        }
        // // If widget has died, do drops
        // if (GetWidgetLife(target.handle) <= 0.405) {
            
        // }
        return true;
    }
    
    TooltipDescription?: ((unit: Unit) => string) | undefined;

}