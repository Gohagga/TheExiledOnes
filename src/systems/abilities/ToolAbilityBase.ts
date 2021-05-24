import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { IToolAbility } from "systems/tools/IToolAbility";
import { Unit } from "w3ts/index";

export interface ToolAbility extends Wc3Ability {
    passiveAbilityCodes?: string[],
    levelPassives?: boolean,
}

export class ToolAbilityBase extends AbilityBase implements IToolAbility {

    private isLevelPassives: boolean;
    private passiveAbilityIds: number[];
    
    constructor(data: ToolAbility) {
        super(data);
        BlzSetAbilityTooltip(this.id, data.name + ' I', 0);
        BlzSetAbilityTooltip(this.id, data.name + ' II', 1);
        BlzSetAbilityTooltip(this.id, data.name + ' III', 2);
        BlzSetAbilityTooltip(this.id, data.name + ' IV', 3);
        
        if (data.tooltip) {

            for (let i = 0; i < 4; i++) {
                BlzSetAbilityExtendedTooltip(this.id, data.tooltip, i);
            }
        }

        this.isLevelPassives = <boolean>data.levelPassives;
        this.passiveAbilityIds = [];
        if (data.passiveAbilityCodes) {
            for (let p of data.passiveAbilityCodes) {
                this.passiveAbilityIds.push(FourCC(p));
            }
        }
    }

    SetLevel(unit: Unit, level: number): boolean {
        Log.Info("Setting level to", level);
        unit.setAbilityLevel(this.id, level);
        
        if (this.TooltipDescription) {
            const a = unit.getAbility(this.id);
            const tooltip = this.TooltipDescription(unit, level);
            BlzSetAbilityStringLevelField(a, ABILITY_SLF_TOOLTIP_NORMAL_EXTENDED, 0, tooltip);
        }

        if (this.isLevelPassives) {
            for (let p of this.passiveAbilityIds) {
                unit.setAbilityLevel(p, level);
            }
        }
        return true;
    }
    
    AddToUnit(unit: Unit, extended?: boolean): boolean {
        const res = this.AddToUnitBase(unit, extended);
        if (res) {
            
            // If it has tooltip defined, override it
            if (this.TooltipDescription) {
                const a = unit.getAbility(this.id);
                const tooltip = this.TooltipDescription(unit, 1);
                BlzSetAbilityStringLevelField(a, ABILITY_SLF_TOOLTIP_NORMAL_EXTENDED, 0, tooltip);
            }
            
            for (let p of this.passiveAbilityIds) {
                unit.addAbility(p);
            }
            return true;
        }
        return false;
    }

    RemoveFromUnit(unit: Unit): boolean {
        
        if (unit.getAbilityLevel(this.id) > 0 || (this.extId && unit.getAbilityLevel(this.extId as number) > 0)) {
            let res = unit.removeAbility(this.id);
            if (this.extId) res = unit.removeAbility(this.extId) || res;

            for (let p of this.passiveAbilityIds) {
                unit.removeAbility(p);
            }
            return res;
        }
        
        Log.Info(this.name, "Failed to remove ability from unit", unit.name);
        return false;
    }

    TooltipDescription?: ((unit: Unit, level?: number) => string) | undefined;
}