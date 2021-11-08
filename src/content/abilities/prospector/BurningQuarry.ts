import { OreType } from "config/OreType";
import { ResourceItem } from "content/items/ResourceItem";
import { MachineFactory } from "content/machines/MachineFactory";
import { Log } from "Log";
import { IEnumUnitService } from "services/enum-service/IEnumUnitService";
import { BuildingAbilityBase, Wc3BuildingAbility } from "systems/abilities/BuildingAbilityBase";
import { IAbility } from "systems/abilities/IAbility";
import { AbilitySlot } from "systems/ability-slots/AbilitySlot";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { MachineManager } from "systems/crafting/machine/MachineManager";
import { Material } from "systems/crafting/Material";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { IItemFactory } from "systems/items/IItemFactory";
import { ErrorService } from "systems/ui/ErrorService";
import { OrderId } from "w3ts/globals/order";
import { Timer, Trigger, Unit } from "w3ts/index";

export interface BurningQuarryAbility extends Wc3BuildingAbility {
    startStopAbilityCode: string,
    collectionRadius: number,
    mineUnitCode1: string,
    mineUnitCode2: string,
    mineUnitCode3: string,
    felCostPerStone: number,
}

export const enum WorkStatus {
    Off,
    Pending,
    Training
}

export class BurningQuarry extends BuildingAbilityBase {

    private startStopAbilityId: number;
    private collectionRadius: number;
    private mineUnitId1: number;
    private mineUnitId2: number;
    private mineUnitId3: number;
    private felCostPerStone: number;

    private instanceWorkStatus: Record<number, WorkStatus> = {};
    private instanceTimers: Record<number, Timer> = {};

    constructor(
        data: BurningQuarryAbility,
        spellbookAbility: IAbility,
        abilityEvent: IAbilityEventHandler,
        slotManager: AbilitySlotManager,
        craftingManager: CraftingManager,
        errorService: ErrorService,
        private enumService: IEnumUnitService,
        private machineFactory: MachineFactory,
        private itemFactory: IItemFactory,
    ) {
        super(data, spellbookAbility, abilityEvent, slotManager, errorService,
            craftingManager.CreateRecipe(data.materials));

        this.startStopAbilityId = FourCC(data.startStopAbilityCode);
        this.mineUnitId1 = FourCC(data.mineUnitCode1);
        this.mineUnitId2 = FourCC(data.mineUnitCode2);
        this.mineUnitId3 = FourCC(data.mineUnitCode3);
        this.collectionRadius = data.collectionRadius;
        this.felCostPerStone = data.felCostPerStone;

        abilityEvent.OnAbilityEffect(this.buildId, (e: AbilityEvent) => this.Execute(e));
        abilityEvent.OnAbilityEffect(this.startStopAbilityId, (e: AbilityEvent) => this.ExecuteStart(e));

        let t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_ORDER);
        t.addAction(() => {
            if (GetIssuedOrderId() == OrderId.Unimmolation)
                this.StopTraining(Unit.fromEvent());
            // else if (GetIssuedOrderId() == OrderId.Cancel) {
            //     let caster = Unit.fromEvent();
            //     if (caster.id in this.instanceWorkStatus && this.instanceWorkStatus[caster.id] == WorkStatus.Training)
            //         caster.mana += this.felCostPerStone;
            // }
        });

        let trainTrig = new Trigger();
        trainTrig.registerAnyUnitEvent(EVENT_PLAYER_UNIT_TRAIN_FINISH);
        trainTrig.addAction(() => this.OnUnitTrained());

        let finishTrig = new Trigger();
        finishTrig.registerAnyUnitEvent(EVENT_PLAYER_UNIT_CONSTRUCT_FINISH);
        finishTrig.addAction(() => this.OnUnitBuilt());
    }

    OnUnitTrained(): void {

        let caster = Unit.fromEvent();

        if (caster.typeId != this.builtUnitId) return;

        let trainedUnit = GetTrainedUnit();
        let mineUnit = GetUnitTypeId(trainedUnit);

        if (caster.id in this.instanceWorkStatus == false ||
            (mineUnit != this.mineUnitId1 && mineUnit != this.mineUnitId2 && this.mineUnitId3 != mineUnit))
            return;

        try {
            RemoveUnit(trainedUnit);

            let t = new Timer();
            t.start(0.0, false, () => {

                this.TryTrain(caster, mineUnit);
                t.destroy();
            });

            let item = this.itemFactory.CreateItemByType(ResourceItem.Stone, caster.x, caster.y);
            caster.addItem(item);

            let rallyUnit = GetUnitRallyUnit(caster.handle);
            if (rallyUnit && (rallyUnit == caster.handle || IsUnitInRangeLoc(caster.handle, GetUnitLoc(rallyUnit), 220))) {

                UnitAddItem(rallyUnit, item.handle);
                return;
            }
            
            let rallyPoint = GetUnitRallyPoint(caster.handle);
            if (rallyPoint && IsUnitInRangeLoc(caster.handle, rallyPoint, 150)) {
                SetItemPositionLoc(item.handle, rallyPoint);
            }
        } catch(ex: any) {
            Log.Error(ex);
        }
    }

    StopTraining(caster: Unit): void {
        
        for (let i = 0; i < 7; i++) {
            // Log.Info("Issuing cancel");
            caster.issueImmediateOrder(OrderId.Cancel);
        }

        this.instanceWorkStatus[caster.id] = WorkStatus.Off;
    }

    TryTrain(caster: Unit, mineUnit: number) {

        if (caster.mana >= this.felCostPerStone) {
            caster.mana -= this.felCostPerStone;
            caster.issueImmediateOrder(mineUnit);
            this.instanceWorkStatus[caster.id] = WorkStatus.Training;
        } else {
            this.errorService.TextTagError("Out of fuel...", caster.x, caster.y);
            this.instanceWorkStatus[caster.id] = WorkStatus.Pending;
        }
    }

    ExecuteStart(e: AbilityEvent): boolean {
        
        const caster = e.caster;
        for (let i = 0; i < 7; i++) {
            // Log.Info("Issuing cancel");
            caster.issueImmediateOrder(OrderId.Cancel);
        }

        if (caster.id in this.instanceWorkStatus == false)
            this.instanceWorkStatus[caster.id] = WorkStatus.Off;

        let mineUnit: number = this.mineUnitId1;

        // Get number of cliffs
        const cliffCount = this.enumService.EnumDestructablesInRange(caster.x, caster.y, this.collectionRadius, d =>
            d.typeId == OreType.StoneQuarry).length;

        if (cliffCount > 0)
            mineUnit = this.mineUnitId3;
        else {
            const pileCount = this.enumService.EnumDestructablesInRange(caster.x, caster.y, this.collectionRadius, d =>
                d.typeId == OreType.StonePile).length;

            if (pileCount > 0)
                mineUnit = this.mineUnitId2;
        }

        this.TryTrain(caster, mineUnit);
        if (caster.id in this.instanceTimers == false)
            this.instanceTimers[caster.id] = new Timer();

        this.instanceTimers[caster.id].start(1, true, () => {

            if (this.instanceWorkStatus[caster.id] == WorkStatus.Off)
                this.instanceTimers[caster.id].pause();
            else if (this.instanceWorkStatus[caster.id] == WorkStatus.Pending)
                this.TryTrain(caster, mineUnit);
        });

        return true;
    }

    OnUnitBuilt(): void {
        let unit = Unit.fromEvent();
        if (unit.typeId == this.builtUnitId) {
            Log.Info("Burning Quarry has finished construction", unit.name);
            // let machine = this.machineFactory.CreateTransmuter(unit);
            // this.machineManager.Register(machine);
        }
    }

    Execute(e: AbilityEvent): boolean {
        
        let caster = e.caster;
        Log.Info(caster.name, "has cast", this.name);

        return this.OnBuild(caster);
    }
}