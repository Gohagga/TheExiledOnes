import { Log } from "Log";
import { IAbility } from "systems/abilities/IAbility";
import { AbilitySlot } from "systems/ability-slots/AbilitySlot";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { ToolManager } from "systems/tools/ToolManager";
import { Unit } from "w3ts/index";
import { PlayerClass } from "./PlayerClass";

export type ResearcherAbilities = {
    ResearcherSpellbook: IAbility,
    // ResearchSpellbook: IAbility,
    TransferItems: IAbility,
    
    // Study: IAbility,
    // OrganicMatter: IAbility,
    // Obliterum: IAbility,
    // ExperimentChamber: IAbility,
    // Bellows: IAbility,
    // Collector: IAbility,
    // FelInjector: IAbility,
    Depot: IAbility,

    // Research

}

export class Researcher extends PlayerClass {

    constructor(
        protected unit: Unit,
        protected abilities: ResearcherAbilities,
        protected basicSlotManager: AbilitySlotManager,
        protected specialSlotManager: AbilitySlotManager,
        protected toolManager: ToolManager,
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
        // this.abilities.ResearchSpellbook.AddToUnit(this.unit);

        this.abilities.TransferItems.AddToUnit(this.unit);

        // this.Add(AbilitySlot.Q, this.abilities.Defile);
        // this.Add(AbilitySlot.W, this.abilities.EyeOfKilrogg);
        // this.Add(AbilitySlot.E, this.abilities.InfuseFelstone);
        // this.Add(AbilitySlot.R, this.abilities.CrystalizeFel);
        // this.Add(AbilitySlot.A, this.abilities.Demonfruit);
        // this.Add(AbilitySlot.S, this.abilities.TransferFel);
        // this.Add(AbilitySlot.D, this.abilities.PrepareFelCollector);
        this.Add(AbilitySlot.F, this.abilities.Depot);

        // Remove and readd spells
        Log.Info("Updating spell list");
        this.basicSlotManager.UpdateSpellList(this.unit);
    }

    private Add(slot: AbilitySlot, ability: IAbility) {
        this.basicSlotManager.ApplySlot(this.unit, slot, ability);
    }
}