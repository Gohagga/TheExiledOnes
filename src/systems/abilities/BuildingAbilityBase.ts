import { Log } from "Log";
import { AbilitySlot } from "systems/ability-slots/AbilitySlot";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { CraftingRecipe } from "systems/crafting/CraftingRecipe";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { ErrorService } from "systems/ui/ErrorService";
import { MapPlayer, Trigger, Unit } from "w3ts/index";
import { AbilityBase } from "./AbilityBase";
import { IAbility } from "./IAbility";
import { Wc3Ability } from "./Wc3Ability";

export interface Wc3BuildingAbility {
    buildCodeId: string,
    prepareCodeId: string,
    builtUnitCodeId: string,
    extCodeId?: string,
    name: string,
    tooltip?: string
}

export class BuildingAbilityBase extends AbilityBase {

    protected buildId: number;
    protected prepareId: number;
    protected builtUnitId: number;
    
    constructor(
        data: Wc3BuildingAbility,
        private readonly spellbookAbility: IAbility,
        abilityEvent: IAbilityEventHandler,
        protected readonly slotManager: AbilitySlotManager,
        protected readonly errorService: ErrorService,
        protected readonly recipe: CraftingRecipe,
    ) {
        super({
            codeId: data.prepareCodeId,
            extCodeId: data.extCodeId,
            name: data.name,
            tooltip: `${data.tooltip}\n\nMaterials\n${recipe.costStringFormatted}`
        });
        this.prepareId = this.id;
        this.buildId = FourCC(data.buildCodeId);
        this.builtUnitId = FourCC(data.builtUnitCodeId);

        abilityEvent.OnAbilityEffect(this.prepareId, (e: AbilityEvent) => this.OnPrepare(e));
        abilityEvent.OnAbilityEffect(this.buildId, (e: AbilityEvent) => this.OnBuild(e.caster));

        // let flag = false;

        // let t = new Trigger();
        // // t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_CONSTRUCT_START);
        // TriggerRegisterEnterRectSimple(t.handle, GetWorldBounds());
        // // t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER);
        // t.addAction(() => {

        //     Log.Error("Unit entered map", Unit.fromEvent().name);
        //     if (GetUnitTypeId(GetTriggerUnit()) == FourCC('h000')) {

        //         if (flag == false) {
        //             let caster = Unit.fromEvent();
        //             Log.Info("Destroying ", caster.name);
        //             let { x, y } = caster;
        //             caster.destroy();
        //             let dummy = new Unit(caster.owner, FourCC('h001'), x, y, 0);
        //             dummy.issueBuildOrder(FourCC('h000'), x, y);
        //             flag = true;
        //         } else {
        //             flag = false;
        //         }
        //     }
        // });
    }

    OnBuild(caster: Unit): void {
        
        this.slotManager.ClearSlot(caster, AbilitySlot.PreparedSlot);
        this.RemoveFromUnit(caster, true);
    }

    OnPrepare(e: AbilityEvent): void {
        
        let caster = e.caster;
        let result = this.recipe.GetHighestTierMaterials(caster);
        
        if (result.successful == false) {
            this.errorService.DisplayError(caster.owner, `Missing materials: ${result.errors.join(', ')}`);
            return;
        }

        result.Consume();
        let existingSlot = this.slotManager.GetSlot(caster, AbilitySlot.PreparedSlot);
        if (existingSlot) existingSlot.RemoveFromUnit(caster, true);
        this.AddToUnit(caster);
        this.slotManager.ApplySlot(caster, AbilitySlot.PreparedSlot, this);

        this.spellbookAbility.RemoveFromUnit(caster);
        this.spellbookAbility.AddToUnit(caster);
    }

    RemoveFromUnit(unit: Unit, onlyBuild?: boolean): boolean {
        
        if (onlyBuild) {
            return unit.removeAbility(this.buildId);
        } else {
            return unit.removeAbility(this.prepareId);
        }
    }

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
            if (!unit.addAbility(this.buildId))
                Log.Error(this.name, "Failed to add ability to unit", unit.name);
            return this.buildId;
        }
    }
    
    TooltipDescription?: ((unit: Unit) => string) | undefined;
}