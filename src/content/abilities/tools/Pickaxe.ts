import { OreType } from "config/OreType";
import { ResourceItem } from "content/items/ResourceItem";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { ErrorService } from "systems/ui/ErrorService";
import { Destructable, Item, Sound, Unit } from "w3ts/index";
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
        
        let { x, y } = target;

        // 15
        let dmg = 20 + (level - 1) * 10;
        
        switch (target.typeId) {
            case OreType.StonePile:
                
                let toDrop = this.DamageVeinAndGetDropCount(caster, target, dmg, 60);
                this.AddItemsAndExp(toDrop * level, caster, x, y, ResourceItem.StoneII, this.experience);
                break;

            case OreType.IronVein:
            
                toDrop = this.DamageVeinAndGetDropCount(caster, target, dmg, 60);
                this.AddItemsAndExp(toDrop * level, caster, x, y, ResourceItem.Iron, this.experience);
                break;
            
            case OreType.CopperVein:
        
                toDrop = this.DamageVeinAndGetDropCount(caster, target, dmg, 60);
                this.AddItemsAndExp(toDrop * level, caster, x, y, ResourceItem.Copper, this.experience);
                break;

            case OreType.SilverVein:
        
                if (level < 2) {
                    this.errorService.DisplayError(caster.owner, "Need level 2 Pickaxe...");
                    return false;
                }
                toDrop = this.DamageVeinAndGetDropCount(caster, target, dmg, 60);
                this.AddItemsAndExp(toDrop * (level - 1), caster, x, y, ResourceItem.Silver, this.experience);
                break;
                
            case OreType.GoldVein:
    
                if (level < 2) {
                    this.errorService.DisplayError(caster.owner, "Need level 2 Pickaxe...");
                    return false;
                }
                toDrop = this.DamageVeinAndGetDropCount(caster, target, dmg, intervalLife);
                this.AddItemsAndExp(toDrop * (level - 1), caster, x, y, ResourceItem.Gold, this.experience);
                break;

            case OreType.Rubble:

                caster.damageTarget(target.handle, dmg, true, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_NORMAL, WEAPON_TYPE_METAL_HEAVY_BASH);
                break;

            default:
                this.errorService.DisplayError(caster.owner, "Target must be debris.");
                break;
        }

        return true;
    }

    AddItemsAndExp(toDrop: number, caster: Unit, x: number, y: number, resource: ResourceItem, experience: number) {
        
        for (let i = 0; i < toDrop; i++) {
            let it = new Item(resource, x, y);
            caster.addItem(it);
            caster.addExperience(experience, true);
        }
    }

    DamageVeinAndGetDropCount(caster: Unit, target: Destructable, dmg: number, intervalLife: number) {
        let startLife = target.life;
        caster.damageTarget(target.handle, dmg, true, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_NORMAL, WEAPON_TYPE_AXE_MEDIUM_CHOP);
        let total = math.floor((target.maxLife - target.life) / intervalLife);
        let alreadyDropped = math.floor((target.maxLife - startLife) / intervalLife);
        let toDrop = total - alreadyDropped;
        return toDrop;
    }
    
    TooltipDescription?: ((unit: Unit) => string) | undefined;

}