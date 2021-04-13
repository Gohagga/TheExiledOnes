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
    InfuseFelstone: IAbility,
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
        this.Add(AbilitySlot.W, this.abilities.InfuseFelstone);
        this.Add(AbilitySlot.E, this.abilities.Demonfruit);
        this.Add(AbilitySlot.R, this.abilities.FelBasin);
        this.Add(AbilitySlot.A, this.abilities.CrystalizeFel);
        this.Add(AbilitySlot.S, this.abilities.EyeOfKilrogg);
        this.Add(AbilitySlot.D, this.abilities.TransferFel);

        // Remove and readd spells
        Log.Info("Updating spell list");
        this.basicSlotManager.UpdateSpellList(this.unit);
        Log.Info("returning");
    }

    private Add(slot: AbilitySlot, ability: IAbility) {
        this.basicSlotManager.ApplySlot(this.unit, slot, ability);
    }
}