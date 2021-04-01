import { Log } from "Log";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { CraftingRecipe } from "systems/crafting/CraftingRecipe";
import { Material } from "systems/crafting/Material";
import { ErrorService } from "systems/ui/ErrorService";
import { OrderId } from "w3ts/globals/order";
import { Item, Trigger, Unit } from "w3ts/index";

export type WorkstationQueue = {
    queue: number[],
    processed: null | number
}

export class WorkstationMachine {

    private recipes: Record<number, { recipe: CraftingRecipe, result: number }> = {};
    private instance: Record<number, WorkstationQueue> = {};

    private onCancelTrig: Trigger;
    private onQueueTrig: Trigger;
    
    constructor(
        private readonly unitTypeId: number,
        private readonly errorService: ErrorService,
        craftingManager: CraftingManager,
    ) {
        Log.Info("bla bla");

        let t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_TRAIN_START)
        t.addAction(() => this.OnTrainStart());
        
        t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_TRAIN_FINISH)
        t.addAction(() => this.OnTrainFinish());

        this.onCancelTrig = new Trigger();
        this.onCancelTrig.registerAnyUnitEvent(EVENT_PLAYER_UNIT_TRAIN_CANCEL)
        this.onCancelTrig.addAction(() => this.OnTrainCancel());

        this.RegisterMachineRecipe(FourCC('oP00'), FourCC('IP00'), craftingManager.CreateRecipe([
            [1, Material.Wood | Material.TierI],
            [1, Material.Stone | Material.TierI],
            [1, Material.Metal | Material.TierI]
        ]));

        this.onQueueTrig = new Trigger();
        this.onQueueTrig.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_ORDER);
        this.onQueueTrig.addAction(() => this.OnTrainQueued());
    }

    public RegisterMachineRecipe(trainedUnitTypeId: number, result: number, recipe: CraftingRecipe) {
        this.recipes[trainedUnitTypeId] = { recipe, result };
    }

    private OnTrainQueued() {

        let caster = Unit.fromEvent();
        let orderId = GetIssuedOrderId();
        if (caster.typeId != this.unitTypeId || orderId == OrderId.Cancel) return;

        let id = caster.id;
        let unitQueue: WorkstationQueue;

        if (id in this.instance == false) this.instance[id] = {
            queue: [],
            processed: null
        };
        unitQueue = this.instance[id];
        unitQueue.queue.push(orderId);
    }
    
    private OnTrainStart() {
        
        let caster = Unit.fromEvent();
        let casterId = caster.id;
        let trainedUnitType = GetTrainedUnitType();

        let part = this.recipes[trainedUnitType];
        
        if (part == null) {
            // Log.Error("Recipe not registered for unit type", GetObjectName(trainedUnitType));
            let unitQueue = this.instance[caster.id];
            unitQueue.queue.shift();
            unitQueue.processed = null;
            return;
        }
        
        let result = part.recipe.CraftTierInclusive(caster);
        if (result.successful == false) {
            // result.DisplayErrors();
            this.errorService.DisplayError(caster.owner, `Missing: ${result.errors.join(', ')}`);

            // Remove the crafted unit from the queue and reissue the orders
            let unitQueue = this.instance[casterId];
            let ordersToQueue = [];
            
            // Shift and cancel the rest, save them for reissuing
            let orderCount = unitQueue.queue.length;

            for (let i = 1; i < orderCount; i++) {
                ordersToQueue.push(unitQueue.queue[i]);
            }

            for (let i = 0; i < orderCount; i++) {
                caster.issueImmediateOrder(OrderId.Cancel);
            }

            // Shift and cancel the latest order
            // caster.issueImmediateOrder(OrderId.Cancel);
            
            for (let trainOrder of ordersToQueue) {
                caster.issueImmediateOrder(trainOrder);
            }
            
            return;
        }
        
        result.Consume();
        let unitQueue = this.instance[caster.id];
        unitQueue.queue.shift();
        unitQueue.processed = part.result;
    }

    private OnTrainCancel() {
        
        let caster = Unit.fromEvent();
        let unitQueue = this.instance[caster.id];
        unitQueue.queue.shift();
    }

    private OnTrainFinish() {
        
        let caster = Unit.fromEvent();
        let u = Unit.fromHandle(GetTrainedUnit());
        u.destroy();
        
        let unitQueue = this.instance[caster.id];
        if (unitQueue.processed)
            caster.addItem(new Item(unitQueue.processed, 0, 0));
    }
}