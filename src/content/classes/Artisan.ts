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
            TransferItems: IAbility,
            // Felsmithing: IAbility,

            Transmute: IAbility,
            TransmuteRock: IAbility,
            TransmuteIron: IAbility,
            CrudeAxe: IAbility,
            CrudePickaxe: IAbility,
            Workstation: IAbility,
            HellForge: IAbility,
            Transmuter: IAbility
        },
        protected basicSlotManager: AbilitySlotManager,
        protected specialSlotManager: AbilitySlotManager
    ) {
        super(unit);
        this.Start();
    }

    protected Progress(): void {

        // Register this unit or reset slots if it exists
        this.basicSlotManager.RegisterUnit(this.unit)
        // this.unit.disableAbility(FourCC('AHbu'), false, true);
        //     this.slotManager.ResetSlots(this.unit);

        // Add Prospector spellbook for this unit
        this.abilities.ArtisanSpellbook.AddToUnit(this.unit);
        this.abilities.TransferItems.AddToUnit(this.unit);

        this.AddBasic(AbilitySlot.Q, this.abilities.Transmute);
        this.AddBasic(AbilitySlot.W, this.abilities.CrudeAxe);
        this.AddBasic(AbilitySlot.E, this.abilities.CrudePickaxe);
        this.AddBasic(AbilitySlot.R, this.abilities.HellForge);
        this.AddBasic(AbilitySlot.A, this.abilities.Workstation);
        this.AddBasic(AbilitySlot.S, this.abilities.Transmuter);
        
        this.abilities.TransmuteRock.AddToUnit(this.unit, true);
        this.abilities.TransmuteIron.AddToUnit(this.unit, true);
        if (this.abilities.TransmuteRock.extId) this.unit.owner.setAbilityAvailable(this.abilities.TransmuteRock.extId, false);
        if (this.abilities.TransmuteIron.extId) this.unit.owner.setAbilityAvailable(this.abilities.TransmuteIron.extId, false);


        // Remove and readd spells
        Log.Info("Updating spell list");
        this.basicSlotManager.UpdateSpellList(this.unit);
    }

    private AddBasic(slot: AbilitySlot, ability: IAbility) {
        this.basicSlotManager.ApplySlot(this.unit, slot, ability);
    }

    private AddForge(slot: AbilitySlot, ability: IAbility) {
        this.specialSlotManager.ApplySlot(this.unit, slot, ability);
    }
}