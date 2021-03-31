import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { IToolAbility } from "systems/tools/IToolAbility";
import { Unit } from "w3ts/index";

export class ToolAbilityBase extends AbilityBase implements IToolAbility {
    
    constructor(data: Wc3Ability) {
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
    }

    SetLevel(unit: Unit, level: number): boolean {
        Log.Info("Setting level to", level);
        unit.setAbilityLevel(this.id, level);
        
        if (this.TooltipDescription) {
            const a = unit.getAbility(this.id);
            const tooltip = this.TooltipDescription(unit, level);
            BlzSetAbilityStringLevelField(a, ABILITY_SLF_TOOLTIP_NORMAL_EXTENDED, 0, tooltip);
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
            
            return true;
        }
        return false;
    }

    TooltipDescription?: ((unit: Unit, level?: number) => string) | undefined;
}