import { Defile } from "content/abilities/prospector/Defile";
import { Log } from "Log";
import { IAbility } from "systems/abilities/IAbility";
import { AbilitySlot } from "systems/ability-slots/AbilitySlot";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { Unit } from "w3ts/index";
import { PlayerClass } from "./PlayerClass";

export class Prospector extends PlayerClass {

    constructor(
        protected unit: Unit,
        protected abilities: {
            ResearcherSpellbook: IAbility,
            ResearchSpellbook: IAbility,
            Study: IAbility,
            OrganicMatter: IAbility,
            Obliterum: IAbility,
            ExperimentChamber: IAbility,
            Bellows: IAbility,
            Collector: IAbility,
            FelInjector: IAbility,

            // Research

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
        //     this.slotManager.ResetSlots(this.unit);

        // Add Prospector spellbook for this unit
        this.abilities.ResearcherSpellbook.AddToUnit(this.unit);
        this.abilities.ResearchSpellbook.AddToUnit(this.unit);

        // this.Add(AbilitySlot.Q, this.abilities.Defile);
        // this.Add(AbilitySlot.W, this.abilities.EyeOfKilrogg);
        // this.Add(AbilitySlot.E, this.abilities.InfuseFelstone);
        // this.Add(AbilitySlot.R, this.abilities.CrystalizeFel);
        // this.Add(AbilitySlot.A, this.abilities.Demonfruit);
        // this.Add(AbilitySlot.S, this.abilities.TransferFel);
        // this.Add(AbilitySlot.D, this.abilities.PrepareFelCollector);

        // Remove and readd spells
        Log.Info("Updating spell list");
        this.basicSlotManager.UpdateSpellList(this.unit);
    }

    private Add(slot: AbilitySlot, ability: IAbility) {
        this.basicSlotManager.ApplySlot(this.unit, slot, ability);
    }
}