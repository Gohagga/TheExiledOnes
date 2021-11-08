import { sharedPlayer } from "config/Config";
import { Log } from "Log";
import { BuildingAbilityBase, Wc3BuildingAbility } from "systems/abilities/BuildingAbilityBase";
import { IAbility } from "systems/abilities/IAbility";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { Material } from "systems/crafting/Material";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { DimensionType } from "systems/events/dimension-events/DimensionType";
import { IDimensionEventHandler } from "systems/events/dimension-events/IDimensionEventHandler";
import { ErrorService } from "systems/ui/ErrorService";
import { OrderId } from "w3ts/globals/order";
import { Destructable, Effect, Item, onHostDetect, Region, Timer, Trigger, Unit } from "w3ts/index";

const Sprite: Record<number, string> = {
    1: "sprite first",
    2: "sprite second",
    3: "sprite third",
    4: "sprite fourth",
    5: "sprite fifth",
    6: "sprite sixth"
}

export class Minecart extends BuildingAbilityBase {

    private instances: Record<number, { followedUnit: Unit, lightning: lightning, timer: Timer }> = {};
    private followedBy: Map<number, Unit> = new Map<number, Unit>();
    private unitSfx: Record<number, effect[]> = {};

    private dummy: Unit;
    
    constructor(
        data: Wc3BuildingAbility,
        spellbookAbility: IAbility,
        abilityEvent: IAbilityEventHandler,
        slotManager: AbilitySlotManager,
        errorService: ErrorService,
        craftingManager: CraftingManager,
        private dimensionEvent: IDimensionEventHandler,
    ) {
        super(data, spellbookAbility, abilityEvent, slotManager, errorService,
            craftingManager.CreateRecipe(data.materials || []));
        
        abilityEvent.OnAbilityEffect(this.buildId, (e: AbilityEvent) => this.OnBuild(e.caster));

        this.dummy = new Unit(PLAYER_NEUTRAL_PASSIVE, FourCC('nDUM'), 0, 0, 0);
        this.dummy.addAbility(FourCC('A00C'));
        
        let finishBuilding = new Trigger();
        finishBuilding.registerAnyUnitEvent(EVENT_PLAYER_UNIT_CONSTRUCT_FINISH);
        finishBuilding.addAction(() => this.OnUnitBuilt());

        let onDeath = new Trigger();
        onDeath.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
        onDeath.registerAnyUnitEvent(EVENT_PLAYER_UNIT_CONSTRUCT_CANCEL);
        onDeath.addAction(() => this.OnDeath());

        let onIssuedPoint = new Trigger();
        onIssuedPoint.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER);
        onIssuedPoint.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER);
        onIssuedPoint.addAction(() => this.OnPointOrder());

        let onDropItem = new Trigger();
        onDropItem.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DROP_ITEM);
        onDropItem.addAction(() => this.OnLoadItem(Unit.fromEvent(), true));

        let onLoadItem = new Trigger();
        onLoadItem.registerAnyUnitEvent(EVENT_PLAYER_UNIT_PICKUP_ITEM);
        onLoadItem.addAction(() => this.OnLoadItem(Unit.fromEvent(), false));

        dimensionEvent.OnSurfaceEvent((e) => this.JumpDimensions(e.unit));
        dimensionEvent.OnUndergroundEvent((e) => this.JumpDimensions(e.unit));

        let onFinishedTransfer = new Trigger();
        onFinishedTransfer.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_FINISH);
        onFinishedTransfer.addAction(() => {

            let unit = Unit.fromEvent();
            if (unit.typeId != this.builtUnitId) return;
            if (GetSpellAbilityId() != FourCC('AT0T')) return;

            let tim = new Timer();
            tim.start(0, false, () => {
                this.OnLoadItem(unit, false);
                tim.destroy();
            });
        });
    }

    private JumpDimensions(followedUnit: Unit) {

        let unitId = followedUnit.id;
        if (this.followedBy.has(unitId)) {
            let u = this.followedBy.get(unitId);
            // if (u) {
            //     u.x = followedUnit.x;
            //     u.y = followedUnit.y;
            // }
            u?.setPosition(followedUnit.x, followedUnit.y);
            u?.issueTargetOrder(OrderId.Smart, followedUnit);
        }
    }

    private EnableMovement(unit: Unit, enable: boolean) {
        if (enable) {
            unit.removeAbility(FourCC('B001'));
        } else {
            this.dummy.issueTargetOrder(OrderId.Entanglingroots, unit);
        }
    }

    private orderLock = false;
    OnPointOrder(): void {
        
        let caster = Unit.fromEvent();
        if (caster.typeId != this.builtUnitId) return;
        
        // In case we are re-ordering it, to prevent infinite loop
        if (this.orderLock) return Log.Info("Skipping");
        // In case it's trying to pick up an item, and it's within range (150 is default pickup range)
        let item = GetOrderTargetItem();
        if (item && IsUnitInRangeXY(caster.handle, GetItemX(item), GetItemY(item), 150)) {
            return;
        }
        // If it's casting Transfer Inventory, let it
        if (GetIssuedOrderId() == OrderId.Unload) return;
        
        let targetUnit = GetOrderTargetUnit();
        Log.Info(caster.name, GetUnitName(targetUnit));
        
        const distance = 300;
        
        if (targetUnit && IsUnitInRange(targetUnit, caster.handle, distance)) {
            this.OnStartFollowing(caster, Unit.fromHandle(targetUnit));
            return;
        }

        this.OnEndFollowing(caster);

        let facing = caster.facing * bj_DEGTORAD;
        let x = caster.x + math.cos(facing);
        let y = caster.y + math.sin(facing);

        this.orderLock = true;
        IssuePointOrderById(caster.handle, OrderId.Smart, x, y);
        // caster.issueImmediateOrder(OrderId.Stop);
        this.orderLock = false;
    }

    OnDropItem() {

        let caster = Unit.fromEvent();
        if (caster.typeId != this.builtUnitId) return;

        // let item = GetManipulatedItem();
        // if (item && IsUnitInRangeXY(caster.handle, GetItemX(item), GetItemY(item), 150)) {
        //     this.OnLoadItem(caster, Item.fromHandle(item));
        //     return;
        // }
    }
    
    OnLoadItem(unit: Unit, isDrop: boolean): void {
        
        if (unit.typeId != this.builtUnitId) return;
        let unitId = unit.id;
        if (unitId in this.unitSfx == false) this.unitSfx[unitId] = [];
        let instance = this.unitSfx[unitId];

        Log.Info("loading item")
        let count = 0;
        for (let i = 0; i < 6; i++) {
            Log.Info(i);
            let sfx = instance[i];
            // Log.Info(sfx);
            // if (sfx) DestroyEffect(sfx);

            let itemInSlot = UnitItemInSlot(unit.handle, i);
            if (itemInSlot) {
                // Log.Info("has item", GetItemName(itemInSlot));
                // const modelPath = // BlzGetItemStringField(item.handle, ITEM_SF_MODEL_USED).replace('\\', '/');
                // Log.Info("Getting item model", modelPath);
                // instance[i] = new Effect(modelPath, unit, Sprite[i]).handle;
                count++;
            }
        }
        Log.Info("count before", count);
        if (isDrop) count--;
        Log.Info("count after", count);
        
        // AddUnitAnimationProperties(unit.handle, 'First', false);
        // AddUnitAnimationProperties(unit.handle, 'Second', false);
        // AddUnitAnimationProperties(unit.handle, 'Third', false);
        // AddUnitAnimationProperties(unit.handle, 'Fourth', false);
        // AddUnitAnimationProperties(unit.handle, 'Fifth', false);

        if (count == 1) {
            // SetUnitAnimationByIndex(unit.handle, count - 1);
            SetUnitAnimation(unit.handle, 'stand');}
        if (count == 2) {
            // AddUnitAnimationProperties(unit.handle, 'first', true);
            SetUnitAnimation(unit.handle, 'stand first');}
        else if (count == 3) {
            // AddUnitAnimationProperties(unit.handle, 'second', true);
            SetUnitAnimation(unit.handle, 'stand second');}
        else if (count == 4) {
            // AddUnitAnimationProperties(unit.handle, 'third', true);
            SetUnitAnimation(unit.handle, 'stand third');}
        else if (count == 5) {
            // AddUnitAnimationProperties(unit.handle, 'fourth', true);
            SetUnitAnimation(unit.handle, 'stand fourth');}
        else if (count == 6) {
            // AddUnitAnimationProperties(unit.handle, 'fifth', true);
            SetUnitAnimation(unit.handle, 'stand fifth');}

        if (count == 0 && instance[0]) {
            Log.Info("destroying");
            DestroyEffect(instance[0]);
            delete instance[0];
        } else if (count > 0 && !instance[0]) {
            Log.Info("creating");
            const modelPath = 'Doodads\LordaeronSummer\\Terrain\\Crates\\crates0.mdx';
            instance[0] = new Effect(modelPath, unit, 'sprite').handle;
        }
    }

    OnStartFollowing(caster: Unit, followedUnit: Unit) {
        
        let id = caster.id;

        this.EnableMovement(caster, true);
        this.followedBy.set(followedUnit.id, caster);

        Log.Info("Creating lightning")
        let z = followedUnit.z;
        if (followedUnit.typeId != this.builtUnitId) z += 50;
        let lightning = AddLightningEx('WHCA', true, caster.x, caster.y, caster.z, followedUnit.x, followedUnit.y, z);
        if (id in this.instances) {
            let instance = this.instances[id];

            if (instance.lightning) DestroyLightning(instance.lightning);
            instance.followedUnit = followedUnit;
            instance.lightning = lightning;
            instance.timer.pause();
        } else {
            this.instances[id] = {
                followedUnit,
                lightning,
                timer: new Timer()
            }
        }
        this.instances[id].timer.start(0.05, true, () => {
            let z = followedUnit.z;
            if (followedUnit.typeId != this.builtUnitId) z += 50;
            MoveLightningEx(this.instances[id].lightning, true, caster.x, caster.y, caster.z, followedUnit.x, followedUnit.y, z);
            let currentOrder = caster.currentOrder;
            if (currentOrder != OrderId.Smart &&
                currentOrder != OrderId.Move &&
                currentOrder != OrderId.Patrol) {
                // If order has changed, cancel the link
                this.OnEndFollowing(caster);
            }
        });
    }

    OnEndFollowing(caster: Unit) {
        let id = caster.id;
        this.EnableMovement(caster, false);

        if (id in this.instances) {
            let instance = this.instances[id];
            this.followedBy.delete(instance.followedUnit.id);

            DestroyLightning(instance.lightning);
            instance.timer.destroy();
            delete this.instances[id];
        }
    }

    OnDeath(): void {
        
        let unit = Unit.fromEvent();
        Log.Info("unit died", unit.name);
    }

    OnUnitBuilt(): void {
        let unit = Unit.fromHandle(GetConstructedStructure());
        // Code will break and not continue if unit is null;
        Log.Info("Unit has entered this shit", unit.name, GetUnitName(GetConstructedStructure()));
        if (unit.typeId == this.builtUnitId) {

        }
    }

    TooltipDescription?: ((unit: Unit) => string) | undefined;
}