import { Log } from "Log";
import { IAbility } from "systems/abilities/IAbility";
import { AbilitySlot } from "systems/ability-slots/AbilitySlot";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { IToolAbility } from "systems/tools/IToolAbility";
import { ToolManager } from "systems/tools/ToolManager";
import { Unit } from "w3ts/index";
import { PlayerClass } from "./PlayerClass";

export type ResearcherAbilities = {
    ResearcherSpellbook: IAbility,
    ResearchSpellbook: IAbility,
    SharedSpellbook: IAbility,
    TransferItems: IAbility,
    
    Study: IAbility,
    OrganicMatter: IAbility,
    Net: IAbility,
    ExperimentChamber: IAbility,
    Automaton: IAbility,
    FelInjector: IAbility,
    Depot: IAbility,
    Obliterum: IAbility,
    
    Hand: IToolAbility,
    
    // Research
    ResearchTank: IAbility,
    ResearchConverter: IAbility,
    ResearchAutomaton: IAbility,
    ResearchDepot: IAbility,

    ItemTransferNode: IAbility,
}

export class Researcher extends PlayerClass {

    constructor(
        protected unit: Unit,
        protected abilities: ResearcherAbilities,
        protected basicSlotManager: AbilitySlotManager,
        protected specialSlotManager: AbilitySlotManager,
        protected sharedSlotManager: AbilitySlotManager,
        protected toolManager: ToolManager,
    ) {
        super(unit);
        this.Start();
    }

    protected Progress(): void {

        // Register this unit or reset slots if it exists
        this.basicSlotManager.RegisterUnit(this.unit);
        this.specialSlotManager.RegisterUnit(this.unit);
        this.sharedSlotManager.RegisterUnit(this.unit);
        //     this.slotManager.ResetSlots(this.unit);

        // Add Prospector spellbook for this unit
        this.abilities.ResearcherSpellbook.AddToUnit(this.unit);
        this.abilities.ResearchSpellbook.AddToUnit(this.unit);
        this.abilities.SharedSpellbook.AddToUnit(this.unit);

        this.abilities.TransferItems.AddToUnit(this.unit);
        this.toolManager.SetDefault(this.unit, this.abilities.Hand);

        this.Add(AbilitySlot.Q, this.abilities.Study);
        this.Add(AbilitySlot.W, this.abilities.OrganicMatter);
        this.Add(AbilitySlot.E, this.abilities.Net);
        this.Add(AbilitySlot.R, this.abilities.ExperimentChamber);
        this.Add(AbilitySlot.A, this.abilities.Automaton);
        this.Add(AbilitySlot.S, this.abilities.FelInjector);
        this.Add(AbilitySlot.D, this.abilities.Depot);
        this.Add(AbilitySlot.F, this.abilities.Obliterum);

        // Forge recipes
        this.AddResearch(AbilitySlot.Q, this.abilities.ResearchTank);
        this.AddResearch(AbilitySlot.W, this.abilities.ResearchConverter);
        this.AddResearch(AbilitySlot.A, this.abilities.ResearchAutomaton);
        this.AddResearch(AbilitySlot.D, this.abilities.ResearchDepot);

        // Add shared
        this.AddShared(AbilitySlot.Q, this.abilities.ItemTransferNode);

        // Remove and readd spells
        Log.Info("Updating spell list");
        this.basicSlotManager.UpdateSpellList(this.unit);
        this.specialSlotManager.UpdateSpellList(this.unit);
        this.sharedSlotManager.UpdateSpellList(this.unit);

        // Leveling
        
        this.basicSlotManager.DisableAbilities(this.unit);
        // this.specialSlotManager.DisableAbilities(this.unit);
        this.Enable(this.abilities.TransferItems, false);
        this.Enable(this.abilities.ResearchSpellbook, false);
        
        this.WaitForUnitLevel(1);
        this.Enable(this.abilities.Study, true);
        this.Enable(this.abilities.Net, true);

        // Research enabled abilities
        this.Enable(this.abilities.Automaton, true);
        this.Enable(this.abilities.Depot, true);

        this.WaitForUnitLevel(2);
        this.Enable(this.abilities.OrganicMatter, true);
        this.Enable(this.abilities.ResearchSpellbook, true);
        this.Enable(this.abilities.TransferItems, true);
        // this.abilities.ResearchTank.DisableForUnit(this.unit, false);
        
        this.WaitForUnitLevel(3);
        this.Enable(this.abilities.ExperimentChamber, true);
        // this.abilities.TransferItems.DisableForUnit(this.unit, false);
        // this.abilities.ResearchConverter.DisableForUnit(this.unit, false);
        // this.abilities.ResearchAutomaton.DisableForUnit(this.unit, false);
        
        this.WaitForUnitLevel(4);
        this.Enable(this.abilities.Obliterum, true);
        // this.abilities..DisableForUnit(this.unit, false); Depot


    }

    private Add(slot: AbilitySlot, ability: IAbility) {
        this.basicSlotManager.ApplySlot(this.unit, slot, ability);
    }

    private AddResearch(slot: AbilitySlot, ability: IAbility) {
        this.specialSlotManager.ApplySlot(this.unit, slot, ability);
    }

    private AddShared(slot: AbilitySlot, ability: IAbility) {
        this.sharedSlotManager.ApplySlot(this.unit, slot, ability);
    }

    private Enable(ability: IAbility, flag: boolean) {
        ability.DisableForUnit(this.unit, !flag);
    }
}