import { Level, Log } from "Log";
import { IEnumUnitService } from "services/enum-service/IEnumUnitService";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { CraftingRecipe } from "systems/crafting/CraftingRecipe";
import { Material } from "systems/crafting/Material";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { ErrorService } from "systems/ui/ErrorService";
import { MapPlayer, Unit } from "w3ts/index";

export type ResearchStage = {
    materials: [number, ...(Material | number)[]][],
    felCost: number,
    upgradeCode?: string,
    name?: string,
    tooltip?: string,
    doesNotRequireBuilding?: boolean
}

export interface ResearchAbility extends Wc3Ability {

    stages: ResearchStage[],
    upgradeCode: string,
}

export class Research extends AbilityBase {
    
    private felCost: number[] = [];
    private recipes: CraftingRecipe[] = [];
    private researchIds: Record<number, number> = {};
    private doesNotRequireBuilding: Record<number, boolean> = {};
    private upgradeId: number;

    private unitsWithAbility: Unit[] = [];

    private tooltip: string;

    constructor(
        data: ResearchAbility,
        abilityEvent: IAbilityEventHandler,
        craftingManager: CraftingManager,
        private readonly enumUnitService: IEnumUnitService,
        private readonly requiredBuildingTypeId: number,
        private readonly errorService: ErrorService,
        private readonly players: MapPlayer[],
    ) {
        super(data);
        this.tooltip = data.tooltip || '';
        this.upgradeId = FourCC(data.upgradeCode);

        let max = data.stages.length;
        data.stages.push({
            materials: [],
            felCost: 0,
        });
        for (let i = 0; i < data.stages.length; i++) {

            let stage = data.stages[i];
            let name = this.name;
            let tooltip = this.tooltip;
            let manacost = stage.felCost;

            if (i < max) {

                let recipe = craftingManager.CreateRecipe(stage.materials);
                name += ` ${i}/${max}`;
                tooltip += '\n\nMaterials\n' + recipe.costStringFormatted;
                if (!stage.doesNotRequireBuilding) {
                    tooltip += '\n|cff76f545' + stage.felCost + ' Fel|r';
                    tooltip += '\n\n|cffe6726aRequires ' + GetObjectName(requiredBuildingTypeId) + ' nearby.|r';
                } else this.doesNotRequireBuilding[i] = true;
                
                this.recipes.push(recipe);
            } else {
                name += " (Finished)";
            }

            if (stage.upgradeCode) this.researchIds[i] = FourCC(stage.upgradeCode);
            this.felCost.push(stage.felCost);

            BlzSetAbilityTooltip(this.id, stage.name || name, i);
            BlzSetAbilityExtendedTooltip(this.id, stage.tooltip || tooltip, i);
            Log.Info("lvl ", i, BlzGetAbilityTooltip(this.id, i));
        }
        // try {
        //     let name = this.name + ' (Finished)';
        //     BlzSetAbilityTooltip(this.id, name, i);
        //     Log.Info("success?", name, i);
        //     BlzSetAbilityExtendedTooltip(this.id, this.tooltip, i);
    
        //     Log.Info("lvl ", i, BlzGetAbilityTooltip(this.id, i));
        //     this.felCost.push(0);
        // } catch (ex) {
        //     Log.Error(ex);
        // }

        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));
    }

    SetAbilityStage(caster: Unit, stage: number) {

        let level = caster.getAbilityLevel(this.id);

        Log.Info("Setting level", level, "to stage", stage);

        if (level > this.recipes.length) return;

        caster.setAbilityLevel(this.id, stage + 1);
        if (this.doesNotRequireBuilding[stage]) caster.setAbilityManaCost(this.id, stage, this.felCost[stage]);

        if (stage >= this.recipes.length) {
            caster.disableAbility(this.id, true, false);
        }
    }

    FinishResearch() {

        for (let p of this.players) {
            p.setTechResearched(this.upgradeId, 1);
        }
        for (let unit of this.unitsWithAbility) {

            if (unit && unit.handle) {
                this.SetAbilityStage(unit, this.recipes.length);
            }
        }
        this.unitsWithAbility = [];
    }

    Execute(e: AbilityEvent): boolean {

        let caster = e.caster;
        let level = e.abilityLevel;
        let requirement = caster.owner.getTechCount(this.upgradeId, true);
        if (requirement == 0) {

            let a = caster.getAbility(this.id);
            let cost = BlzGetAbilityIntegerLevelField(a, ABILITY_ILF_MANA_COST, level - 1);
            let felCost = this.felCost[level - 1];
            let chamber: Unit | null = null;
            
            if (!this.doesNotRequireBuilding[level - 1]) {

                let forges = this.enumUnitService.EnumUnitsInRange(caster.point, 300, (target) =>
                    target.typeId == this.requiredBuildingTypeId);
        
                if (forges.length > 0) chamber = forges[0];

                if (!chamber) {
                    this.errorService.DisplayError(caster.owner, 'Must be near an Experiment Chamber.');
                    caster.mana += cost;
                    return false;
                }

                let felDiff = felCost - chamber.mana;
                if (felDiff > 0) {
                    this.errorService.DisplayError(caster.owner, `${GetObjectName(this.requiredBuildingTypeId)} is missing ${felDiff} Fel.`);
                    caster.mana += cost;
                    return false;
                }
            }
    
            // Then find the stage and try to execute it
            let recipe = this.recipes[level - 1];
            // cost = this.felCost[level];
    
            let lvl = Log.Level;
            // Log.Level = Level.Error;
            let result = recipe.CraftTierInclusive(caster);
            Log.Level = lvl;
            if (result.successful == false) {
                this.errorService.DisplayError(caster.owner, `Missing: ${result.errors.join(', ')}`);
                caster.mana += cost;
                return false;
            }
            
            // If stage is not last, advance
            result.Consume();
            if (chamber) chamber.mana -= felCost;

            if (level == this.recipes.length) {
                this.FinishResearch();
            } else {

                // If there's a research, upgrade it
                if ((level - 1) in this.researchIds) {
                    for (let p of this.players) {
                        p.setTechResearched(this.researchIds[level - 1], 1);
                    }
                    Log.Message("Completed", GetObjectName(this.researchIds[level - 1]));
                }

                this.SetAbilityStage(caster, level);
            }
        }

        this.SetAbilityStage(caster, level - 1);

        // let name = this.name;
        // let tooltip = this.tooltip;
        // let manacost = this.felCost[level - 1];
        // if (level < this.recipes.length) {
        
        //     caster.incAbilityLevel(this.id);
        //     print(level, "level");
        //     level = caster.getAbilityLevel(this.id);
        //     print(level, "level")

        //     name += ` ${level - 1}/${this.recipes.length}`;
        //     tooltip = this.TooltipDescription(caster);
        // } else {
        //     caster.incAbilityLevel(this.id);
        //     name += ' (Finished)';
        //     manacost = 0;
        // }

        // BlzSetAbilityStringLevelField(a, ABILITY_SLF_TOOLTIP_NORMAL, level - 1, name);
        // BlzSetAbilityStringLevelField(a, ABILITY_SLF_TOOLTIP_NORMAL_EXTENDED, level - 1, tooltip);
        // BlzSetAbilityIntegerLevelField(a, ABILITY_ILF_MANA_COST, level - 1, manacost);
        return true;
    }

    AddToUnit(unit: Unit, extended?: boolean): boolean {
        const res = this.AddToUnitBase(unit, extended);
        if (res) {

            let research = unit.owner.getTechCount(this.upgradeId, true);
            if (research > 0) {
                this.SetAbilityStage(unit, this.recipes.length);
            } else {
                let stageAdvancements = Object.keys(this.researchIds);
                for (let key of stageAdvancements) {
                    if (key in this.researchIds) {
                        this.SetAbilityStage(unit, Number(key));
                    }
                }
                this.SetAbilityStage(unit, 0);
            }

            for (let i = 0; i < this.recipes.length + 2; i++) {
                Log.Info(i, "name", BlzGetAbilityTooltip(this.id, i));
            }
            
            // // If it has tooltip defined, override it
            // if (this.TooltipDescription) {
            //     const a = unit.getAbility(this.id);
            //     const tooltip = this.TooltipDescription(unit);
            //     let name = this.name + ` 0/${this.recipes.length}`;

            //     BlzSetAbilityStringLevelField(a, ABILITY_SLF_TOOLTIP_NORMAL, 0, name);
            //     BlzSetAbilityStringLevelField(a, ABILITY_SLF_TOOLTIP_NORMAL_EXTENDED, 0, tooltip);
            //     BlzSetAbilityIntegerLevelField(a, ABILITY_ILF_MANA_COST, 0, this.felCost[0]);
            // }

            this.unitsWithAbility.push(unit);
            
            return true;
        }
        return false;
    }

    TooltipDescription = (u: Unit) =>
`${this.tooltip}

${this.recipes[u.getAbilityLevel(this.id) - 1].costStringFormatted}`;

}