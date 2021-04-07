import { Unit } from "w3ts/index";
import { ISlotManager } from "./ISlotManager";
import { ISlottable } from "./ISlottable";

export class UnitSlotManager<SlotType extends number> implements ISlotManager<Unit, SlotType> {
    
    protected _instances: Record<number, Record<SlotType, ISlottable<Unit>>> = {};

    constructor() {
        
    }

    ApplySlot(owner: Unit, slot: SlotType, item: ISlottable<Unit>): void {
        
        let unitSlots = this._instances[owner.id] || {} as Record<SlotType, ISlottable<Unit>>;
        if (slot in unitSlots) unitSlots[slot](owner);

        unitSlots[slot] = item;
        this._instances[owner.id] = unitSlots;
    }

    GetSlot(owner: Unit, slot: SlotType): ISlottable<Unit> | null {
        if (owner.id in this._instances == false) return null;
        return this._instances[owner.id][slot];
    }

    ClearSlot(owner: Unit, slot: SlotType): boolean {
        
        const id = owner.id;
        if (id in this._instances == false) return false;
        if (slot in this._instances[id]) {
            this._instances[id][slot](owner);
            delete this._instances[id][slot];
            return true;
        }
        return false;
    }
}