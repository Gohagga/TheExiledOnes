import { Log } from "Log";
import { Unit } from "w3ts/index";
import { IAbility } from "./IAbility";
import { Wc3Ability } from "./Wc3Ability";
export abstract class AbilityBase implements Wc3Ability, IAbility {
    
    // Raw wc3 ability data
    codeId: string;
    extCodeId?: string | undefined;
    name: string;
    experience: number;

    // Properties of base ability
    public id: number;
    public extId?: number;

    constructor(data: Wc3Ability) {

        this.codeId = data.codeId;
        this.extCodeId = data.extCodeId
        this.name = data.name;
        this.experience = data.experience || 0;

        this.id = FourCC(data.codeId);
        if (!this.id) Log.Error(this.name, "Failed to translate Ability Id", data.codeId);
        BlzSetAbilityTooltip(this.id, data.name, 0);
        if (data.tooltip) BlzSetAbilityExtendedTooltip(this.id, data.tooltip, 0);

        if (data.extCodeId) {
            this.extId = FourCC(data.extCodeId);
            Log.Info(this.extId);
            if (!this.extId) Log.Error(this.name, "Failed to translate Ability Id", data.extCodeId);
            BlzSetAbilityTooltip(this.extId, data.name, 0);
            if (data.tooltip) BlzSetAbilityExtendedTooltip(this.extId, data.tooltip, 0);
        }
    }

    DisableForUnit(unit: Unit, disable: boolean): void {
        unit.disableAbility(this.id, disable, false);
    }

    AddToUnit(unit: Unit, extended?: boolean): boolean {
        const res = this.AddToUnitBase(unit, extended);
        if (res) {
            
            // If it has tooltip defined, override it
            if (this.TooltipDescription) {
                const a = unit.getAbility(this.id);
                const tooltip = this.TooltipDescription(unit);
                BlzSetAbilityStringLevelField(a, ABILITY_SLF_TOOLTIP_NORMAL_EXTENDED, 0, tooltip);
            }
            
            return true;
        }
        return false;
    }

    /**
     * Attempts to add ability to a unit.
     * It returns which ability id has been given to the unit.
     * @param unit Unit to add the ability to.
     * @param extended If true, will add extended ability instead of default one.
     */
    protected AddToUnitBase(unit: Unit, extended?: boolean): number {
        if (extended && !this.extId) {
            let msg = `Extended ID not configured for '${this.name}', '${this.id}'`;
            Log.Error(this.name, msg);
            throw new Error(msg);
        } else if (extended && this.extId) {
            if (!unit.addAbility(this.extId))
                Log.Error(this.name, "Failed to add extended ability to unit", unit.name);
            return this.extId;
        } else {
            if (!unit.addAbility(this.id))
                Log.Error(this.name, "Failed to add ability to unit", unit.name);
            return this.id;
        }
    }

    RemoveFromUnit(unit: Unit): boolean {
        
        if (unit.getAbilityLevel(this.id) > 0 || (this.extId && unit.getAbilityLevel(this.extId as number) > 0)) {
            let res = unit.removeAbility(this.id);
            if (this.extId) res = unit.removeAbility(this.extId) || res;
            return res;
        }
        
        Log.Info(this.name, "Failed to remove ability from unit", unit.name);
        return false;
    }

    abstract TooltipDescription?: (unit: Unit) => string;

    ApplyCost(unit: Unit, cost: number) {
    }

    Preload(dummy: Unit) {

        dummy.addAbility(this.id)

        if (this.extId) {
            dummy.addAbility(this.extId);
        }
    }
}