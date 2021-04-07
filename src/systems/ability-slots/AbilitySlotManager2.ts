// import { Log } from "Log";
// import { IAbility } from "systems/abilities/IAbility";
// import { ISlottable } from "systems/slot/ISlottable";
// import { UnitSlotManager } from "systems/slot/UnitSlotManager";
// import { Unit } from "w3ts/index";
// import { AbilitySlot } from "./AbilitySlot";
// import { IAbilitySlotManager } from "./IAbilitySlotManager";

// export interface AbilitySlotItem { release: (owner: Unit) => boolean, ability: IAbility }

// export class AbilitySlotManager2 implements IAbilitySlotManager {
    
//     protected _instances: Record<number, Record<AbilitySlot, AbilitySlotItem>> = {};

//     RegisterUnit(unit: Unit): boolean {
//         return true;
//     }

//     ApplySlot(owner: Unit, slot: AbilitySlot, item: AbilitySlotItem): void {
        
//         let unitSlots = this._instances[owner.id] || {} as Record<AbilitySlot, AbilitySlotItem>;
//         if (slot in unitSlots) unitSlots[slot].release(owner);

//         unitSlots[slot] = item;
//         this._instances[owner.id] = unitSlots;
//     }

//     GetSlot(owner: Unit, slot: AbilitySlot): AbilitySlotItem | null {
//         if (owner.id in this._instances == false) return null;
//         return this._instances[owner.id][slot];
//     }

//     ClearSlot(owner: Unit, slot: AbilitySlot): boolean {
        
//         const id = owner.id;
//         if (id in this._instances == false) return false;
//         if (slot in this._instances[id]) {
//             this._instances[id][slot].release(owner);
//             delete this._instances[id][slot];
//             return true;
//         }
//         return false;
//     }

//     ResetAllSlots(unit: Unit): boolean {

//         let unitId = unit.id;
//         if (unitId in this._instances == false) {
//             Log.Error(AbilitySlotManager2, "Unit has not been registered", unit.name);
//             return false;
//         } else {
        
//             let unitSlots = this._instances[unitId];
//             let slots = Object.keys(unitSlots) as unknown as AbilitySlot[];
//             for (let slot of slots) {
//                 if (unitSlots[slot]) {
                    
//                     this._instances[unitId][slot].release(unit);
//                     delete this._instances[unitId][slot];
//                 }
//             }
//         }
//         return true;
//     }

//     UpdateSpellList(unit: Unit): boolean {
        
//         let unitId = unit.id;
//         if (unitId in this._instances == false) {
//             Log.Error(AbilitySlotManager2, "Unit has not been registered", unit.name);
//             return false;
//         } else {
        
//             let unitSlots = this._instances[unitId];
//             let slots = Object.keys(unitSlots) as unknown as AbilitySlot[];
//             slots = slots.sort();
//             Log.Info("Slots count", slots.length);
//             for (let slot of slots) {

//                 Log.Info(slot.toString());
//                 let ability = unitSlots[slot].ability;
//                 if (ability && ability.extId) {
//                     unit.owner.setAbilityAvailable(ability.extId, false);
//                     ability.RemoveFromUnit(unit);
//                 }
//             }

//             for (let slot of slots) {
//                 let ability = unitSlots[slot].ability;
//                 Log.Info(slot.toString());
//                 if (ability)
//                     ability.AddToUnit(unit, true);
//             }
//         }
//         return true;
//     }

// }