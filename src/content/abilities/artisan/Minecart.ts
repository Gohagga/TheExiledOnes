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
import { Destructable, onHostDetect, Rectangle, Region, Timer, Trigger, Unit } from "w3ts/index";

export class Minecart extends BuildingAbilityBase {

    private instances: Record<number, { followedUnit: Unit, lightning: lightning, timer: Timer }> = {};
    
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
            craftingManager.CreateRecipe([
                [3, Material.Metal | Material.TierI],
                [1, Material.Wood | Material.TierII]
            ]));
        
        abilityEvent.OnAbilityEffect(this.buildId, (e: AbilityEvent) => this.OnBuild(e.caster));
        
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
    }

    private orderLock = false;
    OnPointOrder(): void {
        
        
        let caster = Unit.fromEvent();
        if (caster.typeId != this.builtUnitId) return;
        
        if (this.orderLock) return Log.Info("Skipping");
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
        this.orderLock = false;
    }

    OnStartFollowing(caster: Unit, followedUnit: Unit) {
        
        let id = caster.id;
        Log.Info("Creating lightning")
        let z = followedUnit.z;
        if (followedUnit.typeId != this.builtUnitId) z += 50;
        let lightning = AddLightningEx('WHCA', true, caster.x, caster.y, caster.z, followedUnit.x, followedUnit.y, z);
        if (id in this.instances) {
            let instance = this.instances[id];

            if (instance.lightning) DestroyLightning(instance.lightning);
            instance.followedUnit = followedUnit;
            instance.lightning = lightning;
            instance.timer.destroy();
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
        });
    }

    OnEndFollowing(caster: Unit) {
        let id = caster.id;
        if (id in this.instances) {
            let instance = this.instances[id];
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