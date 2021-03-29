import { Log } from "Log";
import { IAbility } from "systems/abilities/IAbility";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { Item } from "w3ts/handles/item";
import { MapPlayer, Trigger, Unit } from "w3ts/index";

export class ToolManager {

    private readonly toolDefinition: Record<number, { ability: IAbility }> = {};
    private readonly instances: Record<number, { ability: IAbility, item: Item }> = {};

    private readonly equipAbilityId: number;

    constructor(equipToolAbilityId: string, private readonly hideItemPosition: { x: number, y: number }) {
        
        this.equipAbilityId = FourCC(equipToolAbilityId);

        let t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_USE_ITEM);
        t.addAction(() => this.Equip(Unit.fromEvent(), Item.fromEvent()));
    }

    RegisterTool(itemTypeCode: string, ability: IAbility) {

        let itemType = FourCC(itemTypeCode);

        this.toolDefinition[itemType] = {
            ability
        }
    }

    Equip(unit: Unit, item: Item) {

        Log.Info("Equipped item", item.name);
        let id = unit.id;
        let itemType = item.typeId;

        let def = this.toolDefinition[itemType];
        if (!def) Log.Error("Missing tool definition for item type", GetObjectName(item.typeId));
        
        SetItemPosition(item.handle, this.hideItemPosition.x, this.hideItemPosition.y);
        
        if (id in this.instances) {
            
            let current = this.instances[id];
            current.ability.RemoveFromUnit(unit);
            unit.addItem(current.item);
            
            current.ability = def.ability;
            current.item = item;
        } else {
            
            this.instances[id] = {
                ability: def.ability,
                item
            }
        }
        def.ability.AddToUnit(unit);
    }

    unequip(unit: Unit) {

        let id = unit.id;
        
        if (id in this.instances) {

            let current = this.instances[id];
            current.ability.RemoveFromUnit(unit);
            unit.addItem(current.item);
        }
    }
}