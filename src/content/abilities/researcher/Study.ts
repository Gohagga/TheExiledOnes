import { Log } from "Log";
import { IEnumUnitService } from "services/enum-service/IEnumUnitService";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { BuildingAbilityBase, Wc3BuildingAbility } from "systems/abilities/BuildingAbilityBase";
import { IAbility } from "systems/abilities/IAbility";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { ErrorService } from "systems/ui/ErrorService";
import { Item, Timer, Trigger, Unit } from "w3ts/index";

export interface StudyAbility extends Wc3Ability {
    radius: number,
    studyExperienceGainCode: string,
}

export class Study extends AbilityBase {
    
    private radius: number;
    private studyExpAuraId: number;

    constructor(
        data: StudyAbility,
        abilityEvent: IAbilityEventHandler,
        private readonly errorService: ErrorService,
        private readonly enumUnitService: IEnumUnitService,
    ) {
        super(data);
        this.radius = data.radius;
        this.studyExpAuraId = FourCC(data.studyExperienceGainCode);
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));
    }

    Execute(e: AbilityEvent): void {
        
        const caster = e.caster;
        const point = e.targetPoint;

        let animals = this.enumUnitService.EnumUnitsInRange(point, this.radius, (target) =>
            target.getAbilityLevel(this.studyExpAuraId) > 0);

        caster.addExperience(animals.length * this.experience, true);
    }

    AddToUnit(unit: Unit, extended?: boolean): boolean {
        const res = this.AddToUnitBase(unit, extended);
        if (res) {
            
            // If it has tooltip defined, override it
            const a = unit.getAbility(this.id);

            if (this.TooltipDescription) {
                const tooltip = this.TooltipDescription(unit);
                BlzSetAbilityStringLevelField(a, ABILITY_SLF_TOOLTIP_NORMAL_EXTENDED, 0, tooltip);
            }
            BlzSetAbilityRealLevelField(a, ABILITY_RLF_AREA_OF_EFFECT, 0, this.radius);
            
            return true;
        }
        return false;
    }

    TooltipDescription?: (u: Unit) => string = undefined;
}

