import { Log } from "Log";
import { Item } from "w3ts/handles/item";
import { Trigger, Unit } from "w3ts/index";
import { IToolAbility } from "./IToolAbility";

export class ToolManager {

    private readonly toolDefinition: Record<number, { ability: IToolAbility, tier: number }> = {};
    private readonly instances: Record<number, { ability: IToolAbility | null, item: Item | null, defaultAbility?: IToolAbility }> = {};

    private readonly equipAbilityId: number;

    constructor(equipToolAbilityId: string, private readonly hideItemPosition: { x: number, y: number }) {
        
        this.equipAbilityId = FourCC(equipToolAbilityId);

        let t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_USE_ITEM);
        t.addAction(() => this.Equip(Unit.fromEvent(), Item.fromEvent()));
    }

    RegisterTool(itemTypeCode: string, ability: IToolAbility, tier: number) {

        let itemType = FourCC(itemTypeCode);

        this.toolDefinition[itemType] = {
            ability,
            tier
        }
    }

    SetDefault(unit: Unit, ability: IToolAbility) {

        let id = unit.id;
        if (id in this.instances) {
            
            let current = this.instances[id];
            current.defaultAbility = ability;
        } else {
            
            this.instances[id] = {
                ability: ability,
                item: null,
                defaultAbility: ability,
            }
            ability.AddToUnit(unit);
        }
    }

    Equip(unit: Unit, item: Item) {

        let id = unit.id;
        let itemType = item.typeId;
        
        let def = this.toolDefinition[itemType];
        if (!def) {
            // Log.Error("Missing tool definition for item type", GetObjectName(item.typeId));
            return;
        }
        
        Log.Info("Equipped item", item.name);
        SetItemPosition(item.handle, this.hideItemPosition.x, this.hideItemPosition.y);
        
        if (id in this.instances) {
            
            let current = this.instances[id];
            if (current.ability) current.ability.RemoveFromUnit(unit);

            if (current.item) unit.addItem(current.item);
            
            current.ability = def.ability;
            current.item = item;
        } else {
            
            this.instances[id] = {
                ability: def.ability,
                item
            }
        }
        def.ability.AddToUnit(unit);
        def.ability.SetLevel(unit, def.tier);
    }

    Unequip(unit: Unit) {

        let id = unit.id;
        
        if (id in this.instances) {

            let current = this.instances[id];
            if (current.ability) current.ability.RemoveFromUnit(unit);

            if (current.item && !unit.addItem(current.item))
                current.item.setPoint(unit.point);
                
            current.item = null;

            if (current.defaultAbility) {
                current.defaultAbility.AddToUnit(unit);
                current.ability = current.defaultAbility;
            } else {
                current.ability = null;
            }
        }
    }
}