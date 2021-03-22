import { Defile } from "content/abilities/prospector/Defile";
import { Log } from "Log";
import { IAbility } from "systems/abilities/IAbility";
import { AbilitySlot } from "systems/ability-slots/AbilitySlot";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { MapPlayer, Unit } from "w3ts/index";
import { PlayerClass } from "./PlayerClass";

export class Prospector extends PlayerClass {
    
    constructor(
        protected unit: Unit,
        protected abilities: {
            ArtisanSpellbook: IAbility,
            Felsmithing: IAbility,
        },
        protected slotManager: AbilitySlotManager
    ) {
        super(unit);
        this.Start();
    }

    protected Progress(): void {

        // Register this unit or reset slots if it exists
        this.slotManager.RegisterUnit(this.unit)
        //     this.slotManager.ResetSlots(this.unit);

        // Add Prospector spellbook for this unit
        this.abilities.ArtisanSpellbook.AddToUnit(this.unit);
        
        // Remove and readd spells
        Log.Info("Updating spell list");
        this.slotManager.UpdateSpellList(this.unit);
    }

    private Add(slot: AbilitySlot, ability: IAbility) {
        this.slotManager.ApplySlot(this.unit, slot, ability);
    }
}