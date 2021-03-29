import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { OreType, ResourceItem } from "systems/map-generation/object-placers/OrePlacer";
import { Item, Unit } from "w3ts/index";

export class Pickaxe extends AbilityBase {

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
        let life = target.life;
        let totalDrops = 4;
        let intervalLife = target.maxLife / totalDrops;

        // 15
        let dmg = 30;//6.25 + (level - 1) * 2;
        caster.damageTarget(target.handle, dmg, true, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_NORMAL, WEAPON_TYPE_AXE_MEDIUM_CHOP);
        
        switch (target.typeId) {
            case OreType.StonePile:

                let total = math.floor((target.maxLife - target.life) / intervalLife);
                let alreadyDropped = math.floor((target.maxLife - life) / intervalLife);
                let toDrop = total - alreadyDropped;
                
                let { x, y } = target;
                for (let i = 0; i < toDrop; i++) {
                    let it = new Item(FourCC('IM00'), x, y);
                    caster.addItem(it);
                }
                break;
        }
        // // If widget has died, do drops
        // if (GetWidgetLife(target.handle) <= 0.405) {
            
        // }
    }
    
    TooltipDescription?: ((unit: Unit) => string) | undefined;

}