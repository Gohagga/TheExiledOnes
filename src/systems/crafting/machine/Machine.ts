import { Log } from "Log";
import { ErrorService } from "systems/ui/ErrorService";
import { Effect, Item, MapPlayer, Timer, Trigger, Unit } from "w3ts/index";
import { CraftingRecipe } from "../CraftingRecipe";
import { CraftingResult } from "../CraftingResult";
import { OrderId } from "w3ts/globals/order";
import { IMachine } from "./IMachine";
import { MachineConfig } from "./MachineConfig";
import { IItemFactory } from "systems/items/IItemFactory";

export class MachineBase implements IMachine {
    
    protected idleState: IWorkState<MachineBase>;
    protected trainingState: IWorkState<MachineBase>;
    protected stuckState: IWorkState<MachineBase>;

    // private attackDummyId: number = FourCC('h002');
    // private stuckAbilityId: number = FourCC('A004');
    // private stunDummy: Unit;
    private afterUnstuck: () => void = () => null;
    private stuckTimer: Timer = new Timer();

    private runningSfxPath: string;
    protected runningSfx: Effect | null = null;
    protected stuckSfx: Effect | null = null;
    protected workSfxOffset: { x: number, y: number, z: number };
    
    private orderCount: number = 0;
    // protected orders: Record<number, number> = {};
    protected recipes: Record<number, CraftingRecipe> = {};
    protected recipeResults: Record<number, (machine: MachineBase, recipeId: number, result: Unit) => void> = {};
    protected processedId: number | null = null;
    protected processedResult: CraftingResult | null = null;
    protected state: IWorkState<MachineBase>;

    constructor(
        config: MachineConfig,
        public readonly unit: Unit,
        private readonly errorService: ErrorService,
        protected readonly itemFactory: IItemFactory,
    ) {
        this.idleState = MachineBase.IdleState;
        this.trainingState = MachineBase.TrainingState;
        this.stuckState = MachineBase.StuckState;

        // this.stunDummy = new Unit(this.unit.owner, this.attackDummyId, this.unit.x, this.unit.y, 0);
        // this.stunDummy.addAbility(this.stuckAbilityId);
        // this.stunDummy.setAttackCooldown(0.1, 0);

        this.runningSfxPath = config.workEffectPath;
        this.workSfxOffset = config.workEffectPosition || { x: 0, y: 0, z: 0 };

        //#region trash rally
        // let t = new Trigger();
        // t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER);
        // t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER);
        // t.addAction(() => {
        //     if (GetTriggerUnit() != this.unit.handle || GetIssuedOrderId() != OrderId.Setrally) return;
        //     let x = GetOrderPointX();
        //     let y = GetOrderPointY();
        //     let u = GetOrderTargetUnit();
        //     if (u) {
        //         x = GetUnitX(u);
        //         y = GetUnitY(u);
        //     }
        //     if (this.unit.inRange(x, y, 220)) return;
        //     let tim = new Timer();
        //     tim.start(0.1, false, () => {

        //         let angle = math.atan(y - this.unit.x, x - this.unit.x);
        //         SetUnitRallyPoint(this.unit.handle, Location(math.cos(angle) * 220, math.sin(angle) * 200));
        //         tim.destroy();
        //     });
        // });
        //#endregion

        this.state = this.idleState;
    }

    // public RegisterOrder(resultId: number, trainId: number) {
    //     Log.Info("Registering order", GetObjectName(resultId), GetObjectName(trainId));
    //     this.orders[resultId] = trainId;
    // }

    public RegisterSimpleItemMachineRecipe(trainId: number, resultItemType: number, recipe: CraftingRecipe) {
        this.RegisterMachineRecipe(trainId, (machine, recipeId, result) => {
            result.destroy();
            let item = this.itemFactory.CreateItemByType(resultItemType);
            machine.unit.addItem(item);

            let rallyUnit = GetUnitRallyUnit(this.unit.handle);
            if (rallyUnit && (rallyUnit == this.unit.handle || IsUnitInRangeLoc(this.unit.handle, GetUnitLoc(rallyUnit), 220))) {

                UnitAddItem(rallyUnit, item.handle);
                return;
            }
            
            let rallyPoint = this.unit.rallyPoint;
            if (IsUnitInRangeLoc(this.unit.handle, rallyPoint.handle, 150)) {
                item.setPoint(rallyPoint);
            }

        }, recipe);
    }
    
    public RegisterMachineRecipe(trainedUnitTypeId: number, result: (machine: MachineBase, recipeId: number, result: Unit) => void, recipe: CraftingRecipe) {
        this.recipes[trainedUnitTypeId] = recipe;
        this.recipeResults[trainedUnitTypeId] = result;
    }

    private StartCraft(recipeId: number): CraftingResult {
        this.processedResult = null;
        this.processedId = recipeId;

        let result: CraftingResult;

        let recipe = this.recipes[recipeId];
        if (recipe) {
            result = recipe.CraftTierInclusive(this.unit);
            this.processedResult = result;
        } else {
            result = new CraftingResult(true, [], 0, 0, this.unit, ['Recipe does not exist']);
        }

        if (result.successful == false) {
            if (IsUnitSelected(this.unit.handle, GetLocalPlayer()))
                this.errorService.DisplayError(MapPlayer.fromLocal(), `Missing: ${result.errors.join(', ')}`);
        } else {
            Log.Info("Consuming items");
            result.Consume();
        }

        return result;
    }

    private RetryCraft(): boolean {
        if (this.processedId == null) return false;

        let recipe = this.recipes[this.processedId];
        if (recipe) {
            let result = recipe.CraftTierInclusive(this.unit);
            this.processedResult = result;

            if (result.successful) {
                result.Consume();
                return true;
            }
        }

        return false;
    }

    private CraftSuccess(recipeId: number, resultUnit: Unit) {
        if (this.processedId && this.processedId in this.recipeResults) {
            this.recipeResults[this.processedId](this, recipeId, resultUnit);
        } else {
            resultUnit.destroy();
        }
    }

    private SetMachineStuck(stuck: boolean, afterUnstuck?: () => void) {
        // Log.Info("Set machine stuck", stuck);
        // if (afterUnstuck) this.afterUnstuck = () => afterUnstuck();

        if (stuck) {
            Log.Info("Pausing unit");
            this.unit.paused = true;
            // this.stunDummy.issueTargetOrder(OrderId.Attackonce, this.unit);
            
            this.stuckTimer.start(1, true, () => {
                if (this.state.OnUpdate)
                    this.state.OnUpdate(this, 1);
            });
        } else {
            Log.Info("Unpausing unit");
            this.unit.paused = false;
            this.stuckTimer.pause();
            // this.stunDummy.issueTargetOrder(OrderId.Attackonce, this.unit);
            // this.stuckTimer.pause();
            // this.stuckTimer.start(1.2, false, () => this.afterUnstuck());
        }
    }

    private ShowRunningSfx(show: boolean) {
        if (show && !this.runningSfx) {
            // Log.Info("Showing running sfx");
            let { x, y } = this.unit;
            this.runningSfx = new Effect(this.runningSfxPath, x + this.workSfxOffset.x, y + this.workSfxOffset.y);
            this.runningSfx.z = this.workSfxOffset.z;
            this.runningSfx.setTimeScale(1.5);
        } else if (!show) {
            this.runningSfx?.destroy();
            this.runningSfx = null;
            // Log.Info("Hiding running sfx");
        }
    }

    private ShowErrorSfx(show: boolean) {
        if (show && !this.stuckSfx) {
            // Log.Info("Showing error sfx");
            if (this.runningSfx) this.runningSfx.setPosition(0, 0, 0);
            this.stuckSfx = new Effect('Abilities/Spells/Orc/StasisTrap/StasisTotemTarget.mdx', this.unit, 'overhead');
        } else if (!show) {
            this.stuckSfx?.destroy();
            this.stuckSfx = null;
            // Log.Info("Hiding error sfx");
        }
    }

    ClearQueue(amount: number = 7) {
        for (let i = 0; i < amount; i++) {
            // Log.Info("Issuing cancel");
            this.unit.issueImmediateOrder(OrderId.Cancel);
        }
        this.orderCount = 0;
    }

    // Order(unit: Unit, item: Item) {
    //     Log.Info("Order", unit.name, item.name);
    //     this.unit.issueImmediateOrder(this.orders[item.typeId]);
    //     item.destroy();
    // }

    QueueUnit(unit: Unit, queuedTypeId: number): void {
        if (queuedTypeId != OrderId.Cancel && this.state.OnQueue) {
            // Log.Info("Queue unit", queuedTypeId);
            this.state.OnQueue(this, queuedTypeId);
        }
    }

    Start(unit: Unit, startId: number): void {
        if (this.state.OnStart) {
            // Log.Info("Start unit", startId);
            this.state.OnStart(this, startId);
        }
    }

    Cancel(unit: Unit, canceledId: number): void {
        if (this.state.OnCancel) {
            // Log.Info("Cancel unit", canceledId);
            this.state.OnCancel(this, canceledId);
        }
    }

    Finish(unit: Unit, finishId: number, finishUnit: Unit): void {
        if (this.state.OnFinish) {
            // Log.Info("Finish unit", finishId);
            this.state.OnFinish(this, finishId, finishUnit);
        }
    }

    Attack(unit: Unit, attacker: Unit): void {
        // Log.Info("Attack unit", attacker.name, this.state.name);
        if (this.state.OnAttack) { // && attacker.typeId != this.attackDummyId) {
            this.state.OnAttack(this, attacker);
        }
    }

    private static IdleState: IWorkState<MachineBase> = {
        name: 'idle',
        OnQueue(machine: MachineBase, recipeId: number) {
            // Log.Info("IdleState")
            machine.orderCount++;
            Log.Info(MapPlayer.fromEvent().name);
        },
    
        OnStart(machine: MachineBase, recipeId: number) {
            
            // Log.Info("IdleState")
            Log.Info(MapPlayer.fromEvent().name);
            let result = machine.StartCraft(recipeId);
            
            if (result.successful == false) {
                machine.ClearQueue(1);
                return;
            }
            
            machine.state = machine.trainingState;
            machine.ShowRunningSfx(true);
        }
    };

    private static TrainingState: IWorkState<MachineBase> = {
        name: 'training',
        OnQueue(machine: MachineBase, recipeId: number) {
            Log.Info("TrainingState")
            machine.orderCount++;
        },
    
        OnStart(machine: MachineBase, recipeId: number) {
            Log.Info("TrainingState")
            let result = machine.StartCraft(recipeId);
            
            if (result.successful == false) {
                machine.SetMachineStuck(true);
                machine.state = machine.stuckState;
                machine.ShowErrorSfx(true);
                machine.ShowRunningSfx(false);
                return;
            }
            machine.ShowErrorSfx(false);
            machine.ShowRunningSfx(true);
        },

        OnCancel(machine: MachineBase) {
            Log.Info("TrainingState")
            machine.orderCount--;
            if (machine.orderCount == 0) {
                machine.state = machine.idleState;
                machine.runningSfx?.setAlpha(0);
                machine.ShowRunningSfx(false);
            }
        },

        OnFinish(machine: MachineBase, recipeId: number, resultUnit: Unit) {
            machine.orderCount--;
            machine.CraftSuccess(recipeId, resultUnit);
            if (machine.orderCount == 0) {
                machine.state = machine.idleState;
                machine.ShowRunningSfx(false);
            }
        }
    };

    private static StuckState: IWorkState<MachineBase> = {
        name: 'stuck',
        OnAttack(machine: MachineBase, attacker: Unit) {
            
            Log.Info("StuckState")
            if (attacker.isAlly(machine.unit.owner)) {
                
                // Remove the damage and return to idle state
                BlzSetEventDamage(0);

                // Unstuck the machine
                machine.SetMachineStuck(false);

                let t = new Timer();
                t.start(0.1, false, () => {
                    machine.ClearQueue();
                    machine.ShowErrorSfx(false);
                    machine.ShowRunningSfx(false);
                    t.destroy();
                });

                machine.state = machine.idleState;
            }
        },

        OnUpdate(machine: MachineBase, period: number) {
            Log.Info("Watching...");

            if (machine.RetryCraft()) {
                machine.SetMachineStuck(false);
                machine.state = machine.trainingState;
                machine.ShowErrorSfx(false);
                machine.ShowRunningSfx(true);
            }
        }
    };
}

export interface IWorkState<T> {
    name: string;
    OnQueue?(machine: T, recipeId: number): void;
    OnStart?(machine: T, recipeId: number): void;
    OnCancel?(machine: T, recipeId: number): void;
    OnFinish?(machine: T, recipeId: number, resultUnit: Unit): void;
    OnAttack?(machine: T, attacker: Unit): void;
    OnUpdate?(machine: T, period: number): void;
}

// Machine registers to certain events and keeps track of internal state machine


// States:

/*
1. Idle state
    - Queue -> validate recipe, cancel and show error, otherwise orders++
    - Start -> Training state
    - Cancel -> nothing

2. Training
    - Queue -> do not validate
    - Start -> if missing materials, Stuck state
    - Cancel -> orders--
    - Finish -> orders--

3. Stuck
    - Queue ->
    - Start ->
    - Cancel ->
    - Attack -> clear queue and Idle state



*/