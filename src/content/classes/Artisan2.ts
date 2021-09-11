import { Log } from "Log";
import { IAbility } from "systems/abilities/IAbility";
import { AbilitySlot } from "systems/ability-slots/AbilitySlot";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { IToolAbility } from "systems/tools/IToolAbility";
import { ToolManager } from "systems/tools/ToolManager";
import { Unit } from "w3ts/index";
import { PlayerClass } from "./PlayerClass";

export type Artisan2Abilities = {
    ArtisanSpellbook: IAbility,
    TransferItems: IAbility,
    Hand: IToolAbility,
    ArtisanFelsmithing: IAbility,

    CrudeAxe: IAbility,
    CrudePickaxe: IAbility,
    Mineshaft: IAbility,
    HellForge: IAbility,
    Workstation: IAbility,
    Assembler: IAbility,
    Minecart: IAbility,

    ForgeSteel: IAbility,
    ForgeFelSteel: IAbility,
    ForgeBuildingTools: IAbility,
    ForgeSoulGem: IAbility,
}

export class Artisan2 extends PlayerClass {
    
    constructor(
        protected unit: Unit,
        protected abilities: Artisan2Abilities,
        protected basicSlotManager: AbilitySlotManager,
        protected specialSlotManager: AbilitySlotManager,
        protected toolManager: ToolManager,
    ) {
        super(unit);
        this.Start();
    }

    protected Progress(): void {

        // Register this unit or reset slots if it exists
        this.basicSlotManager.RegisterUnit(this.unit);
        this.specialSlotManager.RegisterUnit(this.unit);

        // Add Prospector spellbook for this unit
        this.abilities.ArtisanSpellbook.AddToUnit(this.unit);
        this.abilities.ArtisanFelsmithing.AddToUnit(this.unit);
        this.abilities.TransferItems.AddToUnit(this.unit);
        this.toolManager.SetDefault(this.unit, this.abilities.Hand);

        // Basic recipes
        this.AddBasic(AbilitySlot.Q, this.abilities.CrudeAxe);
        this.AddBasic(AbilitySlot.W, this.abilities.CrudePickaxe);
        this.AddBasic(AbilitySlot.E, this.abilities.Mineshaft);
        this.AddBasic(AbilitySlot.R, this.abilities.HellForge);
        this.AddBasic(AbilitySlot.A, this.abilities.Workstation);
        this.AddBasic(AbilitySlot.S, this.abilities.Assembler);
        this.AddBasic(AbilitySlot.D, this.abilities.Minecart);

        // Forge recipes
        this.AddForge(AbilitySlot.Q, this.abilities.ForgeSteel);
        this.AddForge(AbilitySlot.W, this.abilities.ForgeFelSteel);
        this.AddForge(AbilitySlot.E, this.abilities.ForgeBuildingTools);
        this.AddForge(AbilitySlot.R, this.abilities.ForgeSoulGem);
        
        // Remove and readd spells, important to stay after xmute abilities
        Log.Info("Updating spell list");
        this.basicSlotManager.UpdateSpellList(this.unit);
        this.specialSlotManager.UpdateSpellList(this.unit);

        // Leveling
        // let level = 1;

        // while (level < 10) {

        //     this.WaitForUnitLevel(level++);
        //     // this.unit.owner.setTechResearched(this.levelUpgrade, this.unit.level);
        // }

        this.basicSlotManager.DisableAbilities(this.unit);
        // this.specialSlotManager.DisableAbilities(this.unit);
        this.Enable(this.abilities.TransferItems, false);
        this.Enable(this.abilities.ArtisanFelsmithing, false);

        this.WaitForUnitLevel(1);
        this.Enable(this.abilities.CrudeAxe, true);
        this.Enable(this.abilities.CrudePickaxe, true);
        
        this.WaitForUnitLevel(2);
        this.Enable(this.abilities.TransferItems, true);

        this.WaitForUnitLevel(3);
        this.Enable(this.abilities.Workstation, true);
        this.Enable(this.abilities.Assembler, true);

        this.WaitForUnitLevel(4);
        this.Enable(this.abilities.HellForge, true);
        this.Enable(this.abilities.ArtisanFelsmithing, true);

        this.WaitForUnitLevel(5);
        this.Enable(this.abilities.Minecart, true);
        this.Enable(this.abilities.Mineshaft, true);
    }

    private AddBasic(slot: AbilitySlot, ability: IAbility) {
        this.basicSlotManager.ApplySlot(this.unit, slot, ability);
    }

    private AddForge(slot: AbilitySlot, ability: IAbility) {
        this.specialSlotManager.ApplySlot(this.unit, slot, ability);
    }

    private Enable(ability: IAbility, flag: boolean) {
        ability.DisableForUnit(this.unit, !flag);
    }
}