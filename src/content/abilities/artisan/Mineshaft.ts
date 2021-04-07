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

export interface MineshaftWc3Ability extends Wc3BuildingAbility {
    undergroundExitUnitCode: string
}

export class Mineshaft extends BuildingAbilityBase {

    private exitUnitId: number;

    private clearRubbleRect: Rectangle;

    private surfaceWidth: number;
    private surfaceHeight: number;
    private undergroundWidth: number;
    private undergroundHeight: number;

    private surfaceInstance: Record<number, Unit> = {};
    private undergroundInstance: Record<number, Unit> = {};
    
    constructor(
        data: MineshaftWc3Ability,
        spellbookAbility: IAbility,
        private surfaceRect: Rectangle,
        private undergroundRect: Rectangle,
        abilityEvent: IAbilityEventHandler,
        slotManager: AbilitySlotManager,
        errorService: ErrorService,
        craftingManager: CraftingManager,
        private dimensionEvent: IDimensionEventHandler,
    ) {
        super(data, spellbookAbility, abilityEvent, slotManager, errorService,
            craftingManager.CreateRecipe([
                [2, Material.Frame | Material.TierI],
                [2, Material.Stone | Material.TierII]
            ]));
        
        abilityEvent.OnAbilityEffect(this.buildId, (e: AbilityEvent) => this.Execute(e));
        
        this.clearRubbleRect = new Rectangle(0, 0, 350, 350);

        this.surfaceWidth = (surfaceRect.maxX - surfaceRect.minX);
        this.surfaceHeight = (surfaceRect.maxY - surfaceRect.minY);
        this.undergroundWidth = (undergroundRect.maxX - undergroundRect.minX);
        this.undergroundHeight = (undergroundRect.maxY - undergroundRect.minY);
        
        this.exitUnitId = FourCC(data.undergroundExitUnitCode);

        let finishBuilding = new Trigger();
        finishBuilding.registerAnyUnitEvent(EVENT_PLAYER_UNIT_CONSTRUCT_FINISH);
        finishBuilding.addAction(() => {
            // print("mine shaft construction finished");
            this.OnUnitBuilt();
        });

        let startBuilding = new Trigger();
        finishBuilding.registerAnyUnitEvent(EVENT_PLAYER_UNIT_CONSTRUCT_START);
        finishBuilding.addAction(() => this.OnUnitStartBuild());

        // abilityEvent.OnAbilityCast(FourCC('S000'), () => this.OnLoad());

        let onLoad = new Trigger();
        onLoad.registerAnyUnitEvent(EVENT_PLAYER_UNIT_LOADED);
        onLoad.addAction(() => this.OnLoad());

        let onDeath = new Trigger();
        onDeath.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
        onDeath.registerAnyUnitEvent(EVENT_PLAYER_UNIT_CONSTRUCT_CANCEL);
        onDeath.addAction(() => this.OnDeath());
    }

    OnUnitStartBuild(): void {
        
        let unit = Unit.fromEvent();
        unit.setOwner(sharedPlayer, true);
    }

    OnDeath(): void {
        
        let unit = Unit.fromEvent();
        Log.Info("unit died", unit.name)
        if (unit.typeId == this.builtUnitId) {

            let shaftExit = this.surfaceInstance[unit.id];
            if (!shaftExit.handle) Log.Error(Mineshaft, "Exit does not exist");

            shaftExit.destroy();
        }
    }

    OnLoad(): void {
        let loading = Unit.fromHandle(GetTransportUnit());
        let loaded = Unit.fromHandle(GetLoadedUnit());

        let typeId = loading.typeId;
        if (typeId == this.builtUnitId) {

            Log.Info(loading.name, "has loaded", loaded.name, "to underground");

            let shaftExit = this.surfaceInstance[loading.id];
            if (!shaftExit.handle) Log.Error(Mineshaft, "shaftExit does not exist");

            let { x, y } = shaftExit;

            // loaded.kill();
            loading.issueImmediateOrder(OrderId.Standdown);
            loaded.revive(x, y, false);
            loaded.setPosition(x, y);

            // if (loaded.owner.handle == GetLocalPlayer()) {
            //     SetCameraBoundsToRect(this.undergroundRect.handle);
            //     PanCameraToTimed(x, y, 0);
            //     SelectUnitSingle(loaded.handle);
            // }
        } else if (typeId == this.exitUnitId) {
            
            Log.Info(loading.name, "has loaded", loaded.name, "to surface");

            let surfaceExit = this.undergroundInstance[loading.id];
            if (!surfaceExit.handle) Log.Error(Mineshaft, "surfaceExit does not exist");

            let { x, y } = surfaceExit;
            
            // loaded.kill();
            loading.issueImmediateOrder(OrderId.Standdown);
            loaded.revive(x, y, false);
            loaded.setPosition(x, y);
            
            // if (loaded.owner.handle == GetLocalPlayer()) {
            //     SetCameraBoundsToRect(this.surfaceRect.handle);
            //     PanCameraToTimed(x, y, 0);
            //     SelectUnitSingle(loaded.handle);
            // }
        }
    }

    OnUnitBuilt(): void {
        let unit = Unit.fromHandle(GetConstructedStructure());
        Log.Info("Unit has entered this shit", unit.name, GetUnitName(GetConstructedStructure()));
        if (unit.typeId == this.builtUnitId) {

            // Get coordinates of the underground
            let { x, y } = unit;
            let xRatio = (x - this.surfaceRect.minX) / this.surfaceWidth;
            let yRatio = (y - this.surfaceRect.minY) / this.surfaceHeight;

            Log.Info(x, y, xRatio, yRatio);
            
            let targetX = math.floor(xRatio * this.undergroundWidth + this.undergroundRect.minX);
            let targetY = math.floor(yRatio * this.undergroundHeight + this.undergroundRect.minY);
            
            Log.Info(x, y, targetX, targetY, x - this.surfaceRect.minX - targetX, y - this.surfaceHeight - targetY);
            
            let tileSize = 128;
            Log.Info("target", targetX, targetY);
            targetX = (targetX + tileSize - 1) & -tileSize + tileSize / 2;
            targetY = (targetY + tileSize - 1) & -tileSize + tileSize / 2;
            Log.Info("target after", targetX, targetY);

            Log.Info(targetX, targetY);

            this.clearRubbleRect.move(targetX, targetY);
            EnumDestructablesInRect(this.clearRubbleRect.handle, null, () => {
                KillDestructable(GetEnumDestructable());
            });

            let exitUnit = new Unit(sharedPlayer, this.exitUnitId, targetX, targetY, 260);
            this.surfaceInstance[unit.id] = exitUnit;
            this.undergroundInstance[exitUnit.id] = unit;
        }
    }

    Execute(e: AbilityEvent): void {
        let caster = e.caster;
        Log.Info("executed");
        this.OnBuild(caster);
    }

    TooltipDescription?: ((unit: Unit) => string) | undefined;
}