import { Defile } from "content/abilities/prospector/Defile";
import { Log } from "Log";
import { IAbility } from "systems/abilities/IAbility";
import { AbilitySlot } from "systems/ability-slots/AbilitySlot";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { MapPlayer, Unit } from "w3ts/index";
import { PlayerClass } from "./PlayerClass";

export class Artisan extends PlayerClass {
    
    constructor(
        protected unit: Unit,
        protected abilities: {
            ArtisanSpellbook: IAbility,
            // Felsmithing: IAbility,

            CrudeAxe: IAbility,
            CrudePickaxe: IAbility,
            Workstation: IAbility,
            HellForge: IAbility,
            Transmuter: IAbility
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

        this.Add(AbilitySlot.Q, this.abilities.CrudeAxe);
        this.Add(AbilitySlot.W, this.abilities.CrudePickaxe);
        this.Add(AbilitySlot.E, this.abilities.Workstation);
        this.Add(AbilitySlot.R, this.abilities.HellForge);
        this.Add(AbilitySlot.A, this.abilities.Transmuter);

        // Remove and readd spells
        Log.Info("Updating spell list");
        this.slotManager.UpdateSpellList(this.unit);
    }

    private Add(slot: AbilitySlot, ability: IAbility) {
        this.slotManager.ApplySlot(this.unit, slot, ability);
    }
}