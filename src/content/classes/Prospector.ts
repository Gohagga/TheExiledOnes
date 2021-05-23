import { Log } from "Log";
import { IAbility } from "systems/abilities/IAbility";
import { AbilitySlot } from "systems/ability-slots/AbilitySlot";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { IToolAbility } from "systems/tools/IToolAbility";
import { ToolManager } from "systems/tools/ToolManager";
import { Unit } from "w3ts/index";
import { PlayerClass } from "./PlayerClass";

export type ProspectorAbilities = {
    ProspectorSpellbook: IAbility,
    TransferItems: IAbility,

    Defile: IAbility,
    EyeOfKilrogg: IAbility,
    FelExtraction: IAbility,
    CrystalizeFel: IAbility,
    Demonfruit: IAbility,
    TransferFel: IAbility,
    FelBasin: IAbility,

    Hand: IToolAbility,
}

export class Prospector extends PlayerClass {
    
    constructor(
        protected unit: Unit,
        protected abilities: ProspectorAbilities,
        protected basicSlotManager: AbilitySlotManager,
        protected specialSlotManager: AbilitySlotManager,
        protected toolManager: ToolManager
    ) {
        super(unit);
        this.Start();
    }

    protected Progress(): void {

        // Register this unit or reset slots if it exists
        this.basicSlotManager.RegisterUnit(this.unit)
        //     this.slotManager.ResetSlots(this.unit);

        // Add Prospector spellbook for this unit
        this.abilities.ProspectorSpellbook.AddToUnit(this.unit);
        // Add Transfer items
        this.abilities.TransferItems.AddToUnit(this.unit);
        this.toolManager.SetDefault(this.unit, this.abilities.Hand);

        this.Add(AbilitySlot.Q, this.abilities.Defile);
        this.Add(AbilitySlot.W, this.abilities.FelExtraction);
        this.Add(AbilitySlot.E, this.abilities.Demonfruit);
        this.Add(AbilitySlot.R, this.abilities.FelBasin);
        this.Add(AbilitySlot.A, this.abilities.CrystalizeFel);
        this.Add(AbilitySlot.S, this.abilities.EyeOfKilrogg);
        this.Add(AbilitySlot.D, this.abilities.TransferFel);

        // Remove and readd spells
        Log.Info("Updating spell list");
        this.basicSlotManager.UpdateSpellList(this.unit);
        Log.Info("returning");

        // Leveling

        this.basicSlotManager.DisableAbilities(this.unit);
        // this.specialSlotManager.DisableAbilities(this.unit);
        this.Enable(this.abilities.TransferItems, false);

        this.WaitForUnitLevel(1);
        this.Enable(this.abilities.Defile, true);
        this.Enable(this.abilities.EyeOfKilrogg, true);
        this.Enable(this.abilities.FelExtraction, true);

        this.WaitForUnitLevel(2);
        this.Enable(this.abilities.Demonfruit, true);
        this.Enable(this.abilities.CrystalizeFel, true);
        this.Enable(this.abilities.TransferItems, true);
        
        this.WaitForUnitLevel(3);
        this.Enable(this.abilities.FelBasin, true);
        
        this.WaitForUnitLevel(4);
        this.Enable(this.abilities.TransferFel, true);

        this.WaitForUnitLevel(5);
        // this.Enable(this.abilities.FelExtraction, true);
    }

    private Add(slot: AbilitySlot, ability: IAbility) {
        this.basicSlotManager.ApplySlot(this.unit, slot, ability);
    }

    private Enable(ability: IAbility, flag: boolean) {
        ability.DisableForUnit(this.unit, !flag);
    }
}