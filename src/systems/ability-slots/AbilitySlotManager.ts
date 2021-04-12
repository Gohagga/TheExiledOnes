import { Log } from "Log";
import { IAbility } from "systems/abilities/IAbility";
import { Unit } from "w3ts/index";
import { AbilitySlot } from "./AbilitySlot";

export class AbilitySlotManager {

    protected instances: Record<number, Record<AbilitySlot, IAbility>> = {};

    GetSlot(unit: Unit, slot: AbilitySlot): IAbility | null {
        
        let unitId = unit.id;
        if (unitId in this.instances == false) {
            Log.Error(AbilitySlotManager, "Unit has not been registered", unit.name);
            return null;
        } else {
        
            let unitSlots = this.instances[unitId];
            if (slot in unitSlots) return unitSlots[slot];
            return null;
        }
    }

    ApplySlot(unit: Unit, slot: AbilitySlot, ability: IAbility) {
        
        let unitId = unit.id;
        if (unitId in this.instances == false) {
            Log.Error(AbilitySlotManager, "Unit has not been registered", unit.name);
            return false;
        } else {
        
            let unitSlots = this.instances[unitId];
            if (slot in unitSlots) unitSlots[slot].RemoveFromUnit(unit);
            this.instances[unitId][slot] = ability;
        }
    }

    OnlyApplySlot(unit: Unit, slot: AbilitySlot, ability: IAbility) {
        
        let unitId = unit.id;
        if (unitId in this.instances == false) {
            Log.Error(AbilitySlotManager, "Unit has not been registered", unit.name);
            return false;
        } else {
            this.instances[unitId][slot] = ability;
        }
    }

    ClearSlot(unit: Unit, slot: AbilitySlot): boolean {

        let unitId = unit.id;
        if (unitId in this.instances == false) {
            Log.Error(AbilitySlotManager, "Unit has not been registered", unit.name);
            return false;
        } else {
        
            let unitSlots = this.instances[unitId];
            if (slot in unitSlots) delete unitSlots[slot];
            return true;
        }
    }

    RegisterUnit(unit: Unit): boolean {

        let unitId = unit.id;
        if (unitId in this.instances) {
            Log.Error(AbilitySlotManager, "Unit has been registered already", unit.name);
            return false;
        } else {
            this.instances[unitId] = {} as Record<AbilitySlot, IAbility>;
            return true;
        }
    }

    ResetAllSlots(unit: Unit): boolean {

        let unitId = unit.id;
        if (unitId in this.instances == false) {
            Log.Error(AbilitySlotManager, "Unit has not been registered", unit.name);
            return false;
        } else {
        
            let unitSlots = this.instances[unitId];
            let slots = Object.keys(unitSlots) as unknown as AbilitySlot[];
            for (let slot of slots) {
                if (unitSlots[slot]) {
                    
                    this.instances[unitId][slot].RemoveFromUnit(unit);
                    delete this.instances[unitId][slot];
                }
            }
        }
        return true;
    }

    UpdateSpellList(unit: Unit): boolean {
        
        let unitId = unit.id;
        if (unitId in this.instances == false) {
            Log.Info(AbilitySlotManager, "Unit has not been registered", unit.name);
            return false;
        } else {
        
            let unitSlots = this.instances[unitId];
            let slots = Object.keys(unitSlots) as unknown as AbilitySlot[];
            slots = slots.sort();
            Log.Info("Slots count", slots.length);
            for (let slot of slots) {

                Log.Info(slot.toString());
                let ability = unitSlots[slot];
                if (ability && ability.extId) {
                    unit.owner.setAbilityAvailable(ability.extId, false);
                    unitSlots[slot].RemoveFromUnit(unit);
                }
            }

            for (let slot of slots) {
                let ability = unitSlots[slot];
                if (ability) {
                    Log.Info("adding slot", slot.toString(), (ability as any).name);
                    ability.AddToUnit(unit, true)
                }
            }
        }
        return true;
    }
}