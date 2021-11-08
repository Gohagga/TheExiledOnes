import { Log } from "Log";
import { BuildingAbilityBase, Wc3BuildingAbility } from "systems/abilities/BuildingAbilityBase";
import { IAbility } from "systems/abilities/IAbility";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { ToolManager } from "systems/tools/ToolManager";
import { ErrorService } from "systems/ui/ErrorService";
import { OrderId } from "w3ts/globals/order";
import { Destructable, Effect, Item, Point, Rectangle, Timer, Trigger, Unit, Widget } from "w3ts/index";
import { Hand } from "../tools/Hand";

export interface AutomatonAbility extends Wc3BuildingAbility {
    orderPickupCode: string,
    orderToolCode: string,
    filterCode: string,
    workEffectPath: string,
}

export type AutomatonTask = {
    order: AutomatonState,
    currentState: AutomatonState,
    targetPoint: Point,
    widget: Widget | null,
    runningSfx: Effect | null,
    timer: Timer,
}

export class Automaton extends BuildingAbilityBase {

    private instance: Record<number, AutomatonTask> = {};
    private itemFilters: Record<number, number[]> = {};

    private invAutomatonId = FourCC('A00I');
    private filterId: number;
    private workEffectPath: string;
    private operationFuelCost: number = 0.2;

    private enumRect: Rectangle;

    constructor(
        data: AutomatonAbility,
        spellbookAbility: IAbility,
        abilityEvent: IAbilityEventHandler,
        slotManager: AbilitySlotManager,
        errorService: ErrorService,
        craftingManager: CraftingManager,
        private readonly toolManager: ToolManager,
        private readonly hand: Hand,
    ) {
        super(data, spellbookAbility, abilityEvent, slotManager, errorService,
            craftingManager.CreateRecipe(data.materials || []));
        
        this.filterId = FourCC(data.filterCode);
        abilityEvent.OnAbilityEffect(this.buildId, (e: AbilityEvent) => this.Execute(e));
        abilityEvent.OnAbilityEffect(FourCC(data.orderPickupCode), (e: AbilityEvent) => this.ExecuteSupplyOrder(e));
        abilityEvent.OnAbilityEffect(FourCC(data.orderToolCode), (e: AbilityEvent) => this.ExecuteToolOrder(e));
        abilityEvent.OnAbilityEffect(this.filterId, (e: AbilityEvent) => this.ExecuteItemFilter(e));

        this.enumRect = new Rectangle(0, 0, 512, 512);
        this.workEffectPath = data.workEffectPath;

        let finishBuilding = new Trigger();
        finishBuilding.registerAnyUnitEvent(EVENT_PLAYER_UNIT_CONSTRUCT_FINISH);
        finishBuilding.addAction(() => this.OnUnitBuilt());

        let cancelTaskTrg = new Trigger();
        cancelTaskTrg.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_ORDER);
        cancelTaskTrg.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER);
        cancelTaskTrg.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER);
        cancelTaskTrg.addAction(() => {
            let orderId = GetIssuedOrderId();
            let unit = Unit.fromEvent();
            if (unit.typeId == this.builtUnitId &&
                orderId != OrderId.Sentinel &&
                orderId != OrderId.Unload &&
                orderId != OrderId.Smart &&
                orderId != OrderId.Stop) {

                    this.StopAutomationTask(unit);
                }
        })
    }

    ExecuteItemFilter(e: AbilityEvent): boolean {
        
        let caster = e.caster;
        let unitId = caster.id;
        
        let name = '';
        let tooltip = '';

        if (unitId in this.itemFilters == false) {

            this.itemFilters[unitId] = [];
            let filter = this.itemFilters[unitId];
            
            while (filter.pop()) {};

            let ability = caster.getAbility(this.invAutomatonId);
            let level = caster.getAbilityLevel(this.invAutomatonId) - 1;
            let count = BlzGetAbilityIntegerLevelField(ability, ABILITY_ILF_ITEM_CAPACITY, level);

            tooltip = this.FilterItemsTooltip();

            for (let i = 0; i < count; i++) {
                let it = UnitItemInSlot(caster.handle, i);
                if (it) filter.push(GetItemTypeId(it));
                tooltip += GetItemName(it) + '\t';
                if (i % 2 == 0) tooltip += '\n';
            }

            name = 'Configured Item Filter';

        } else {
            delete this.itemFilters[unitId];
            tooltip = 'Click to configure item filter based on current inventory.'
            name = 'Filter Items';
        }
        
        let a = caster.getAbility(this.filterId);
        BlzSetAbilityStringLevelField(a, ABILITY_SLF_TOOLTIP_NORMAL, 0, name);
        BlzSetAbilityStringLevelField(a, ABILITY_SLF_TOOLTIP_NORMAL_EXTENDED, 0, tooltip);
        return true;
    }

    ExecuteToolOrder(e: AbilityEvent): boolean {
        
        Log.Info("Tool order");
        let caster = e.caster;
        let targetPoint = e.targetPoint;

        let currentState: AutomatonState = this.HandNearbyTrees;
        
        Log.Info("Checking inventory");
        if (this.IsInventoryFull(caster)) {
            currentState = this.ReturnState;
        }

        Log.Info("Yes");

        let instance: AutomatonTask = this.instance[caster.id] || {
            order: this.HandNearbyTrees,
            currentState,
            targetPoint,
            timer: new Timer()
        };
        this.instance[caster.id] = instance;

        this.StartAutomatonTask(caster);
        return true;
    }

    private IsInventoryFull(unit: Unit) {
        // Check inventory, if is full, set the state accordingly
        // Try giving it an item, if it fails means inv is full
        let hcun = CreateItem(FourCC('hcun'), 0, 0);
        let isFull = !UnitAddItem(unit.handle, hcun);
        RemoveItem(hcun);
        return isFull;
    }

    private HasFilterItems(unit: Unit) {
        
        let unitId = unit.id;
        if (unitId in this.itemFilters == false) {
            return this.IsInventoryFull(unit);
        } else {
            let filter = this.itemFilters[unitId];

            let hasItems = true;

            // let level = unit.getAbilityLevel(this.invAutomatonId) - 1;
            // let count = BlzGetAbilityIntegerLevelField(unit.getAbility(this.invAutomatonId), ABILITY_ILF_ITEM_CAPACITY, level);
            for (let i = 0; i < filter.length; i++) {

                let inSlot = UnitItemInSlot(unit.handle, i);
                if (!inSlot) {
                    hasItems = false;
                } if (inSlot && GetItemTypeId(inSlot) != filter[i]) {
                    unit.removeItemFromSlot(i);
                    hasItems = false;
                }
            }
            
            return hasItems;
        }
    }

    StartAutomatonTask(unit: Unit) {
        
        let unitId = unit.id;
        if (unitId in this.instance) this.instance[unitId].timer.pause();

        let instance = this.instance[unitId];
        instance.timer.start(1, true, () => {

            let inst = this.instance[unitId];
            inst.currentState = inst.currentState.Update(unit, inst) || inst.order;
        });
        instance.runningSfx = new Effect(this.workEffectPath, unit, 'overhead');
    }

    StopAutomationTask(unit: Unit) {

        let unitId = unit.id;
        if (unitId in this.instance) {
            let instance = this.instance[unitId];
            instance.timer.destroy();
            if (instance.runningSfx)
                instance.runningSfx.destroy();
        }
        delete this.instance[unitId];
    }

    ExecuteSupplyOrder(e: AbilityEvent) {
        
        Log.Info("Supply order");
        let caster = e.caster;
        let targetPoint = e.targetPoint;

        let currentState: AutomatonState = this.SupplyState;
        
        Log.Info("Checking inventory");
        if (this.HasFilterItems(caster)) {
            currentState = this.ReturnState;
        }

        Log.Info("Yes");

        let instance: AutomatonTask = this.instance[caster.id] || {
            order: this.SupplyState,
            currentState,
            targetPoint,
            timer: new Timer()
        };
        this.instance[caster.id] = instance;

        this.StartAutomatonTask(caster);
        return true;
    }

    Execute(e: AbilityEvent): boolean {
        
        return this.OnBuild(e.caster);
    }

    OnUnitBuilt(): boolean {
        
        let unit = Unit.fromEvent();
        if (unit.typeId != this.builtUnitId) return false;

        this.toolManager.SetDefault(unit, this.hand);
        return true;
    }

    private ReturnState: AutomatonState = {
        Update: (automaton: Unit, task: AutomatonTask) => {

            if (automaton.mana < this.operationFuelCost) {
                this.errorService.TextTagError("Out of fuel", automaton.x, automaton.y);
                // this.StopAutomationTask(automaton);
                automaton.issueImmediateOrder(OrderId.Stop);
                return null;
            }

            automaton.mana -= this.operationFuelCost;

            // If the unit is trying to unload, just return
            if (automaton.currentOrder == OrderId.Unload) return task.currentState;

            // If not, check unit's inventory, if it's not full, swap to order state
            if (this.HasFilterItems(automaton) == false) return null;

            // If inventory is full, issue the drop command
            let rallyPoint = GetUnitRallyPoint(automaton.handle);
            let rallyUnit = GetUnitRallyUnit(automaton.handle);

            // If there was no setting for return, just stop and do nothing
            if (rallyPoint == null && rallyUnit) {
                automaton.issueImmediateOrder(OrderId.Stop);
                return null;
            } else if (rallyUnit) {
                IssueTargetOrderById(automaton.handle, OrderId.Unload, rallyUnit);
            } else if (rallyPoint) {
                IssuePointOrderById(automaton.handle, OrderId.Unload, GetLocationX(rallyPoint), GetLocationY(rallyPoint));
            }

            return task.currentState;
        }
    }

    private SupplyState: AutomatonState = {
        Update: (automaton: Unit, task: AutomatonTask) => {
            
            if (automaton.mana < this.operationFuelCost) {
                this.errorService.TextTagError("Out of fuel", automaton.x, automaton.y);
                // this.StopAutomationTask(automaton);
                automaton.issueImmediateOrder(OrderId.Stop);
                return null;
            }

            automaton.mana -= this.operationFuelCost;

            // Check unit's inventory, if it full, swap to return
            if (this.HasFilterItems(automaton)) {
                task.widget = null;
                return this.ReturnState;
            }

            // If the unit is already picking, return
            if (automaton.currentOrder == OrderId.Smart &&
                task.widget &&
                automaton.inRange(task.widget.x, task.widget.y, 1500)) return task.currentState;

            try {

                // if (task.widget && automaton.hasItem(task.widget as Item))
                //     task.widget = null;

                // if (!task.widget) {

                    Log.Info("Widget empty, looking for closest item");
                    Log.Info("Ordering to pick item")

                    let automatonId = automaton.id;
                    let nextItemType: number | null = null;
                    if (automatonId in this.itemFilters) {

                        let filter = this.itemFilters[automatonId];
                        for (let i = 0; i < filter.length; i++) {
                            
                            let inSlot = UnitItemInSlot(automaton.handle, i);
                            if (!inSlot || GetItemTypeId(inSlot) != filter[i]) {
                                nextItemType = filter[i];
                                break;
                            }
                        }
                    }

                    // Else, issue pick at nearest tree
                    let { x, y } = automaton;
                    this.enumRect.move(task.targetPoint.x, task.targetPoint.y);
                    
                    let items: Item[] = [];
                    let sorted: { index: number, value: number }[] = [];
                    EnumItemsInRect(this.enumRect.handle, null, () => {
                        
                        let item = Item.fromHandle(GetEnumItem());
                        let dx = item.x;
                        let dy = item.y;
                        let distanceSq = (x-dx)*(x-dx) + (y-dy)*(y-dy);
                        let value = !nextItemType || nextItemType == item.typeId ? 1 / distanceSq : 0;
                        let index = items.push(item);
                        sorted.push({
                            index: index - 1,
                            value: value,
                        });
                    });

                    Log.Info("Found items", sorted.length);
    
                    let closest: Item | null = null;
                    let closestValue = 0;
    
                    for (let d of sorted) {
        
                        if (d.value > closestValue) {
                            closest = items[d.index];
                            closestValue = d.value;
                        }
                    }
                    if (closest) {
                        Log.Info("Found closest item", closest.name);
                        task.widget = closest;
                    }
                // }
    
                if (task.widget) {
                    Log.Info("Issuing pickup");
                    automaton.issueTargetOrder(OrderId.Smart, task.widget);
                } else {
                    // Log.Info("the task");
                    // this.StopAutomationTask(automaton);
                }
            } catch (ex: any) {
                Log.Error(ex);
            }
            return null;
        }
    }

    private HandNearbyTrees: AutomatonState = {
        Update: (automaton: Unit, task: AutomatonTask) => {

            if (automaton.mana < this.operationFuelCost) {
                this.errorService.TextTagError("Out of fuel", automaton.x, automaton.y);
                automaton.issueImmediateOrder(OrderId.Stop);
                return null;
            }

            automaton.mana -= this.operationFuelCost;
            
            // Check unit's inventory, if it full, swap to return
            if (this.IsInventoryFull(automaton)) return this.ReturnState;

            // If the unit is already picking, return
            if (automaton.currentOrder == OrderId.Sentinel) return task.currentState;

            Log.Info("Ordering to pick trees")

            // Else, issue pick at nearest tree
            let { x, y } = task.targetPoint;
            this.enumRect.move(x, y);
            
            let dest: Destructable[] = [];
            EnumDestructablesInRect(this.enumRect.handle, null, () => {
                dest.push(Destructable.fromHandle(GetEnumDestructable()));
            });

            Log.Info("Found destructables", dest.length);

            if (!task.widget || task.widget.life <= 0.405) {

                Log.Info("Widget empty, looking for closest tree");
                let closest: Destructable | null = null;
                let closestDist = 9999999999;
                for (let d of dest) {
                    let dx = d.x;
                    let dy = d.y;
    
                    let distanceSq = (x-dx)*(x-dx) + (y-dy)*(y-dy);
                    if (distanceSq < closestDist) {
                        closest = d;
                        closestDist = distanceSq;
                    }
                }
                if (closest) {
                    Log.Info("Found closest tree", closest.name);
                    task.widget = closest;
                }
            }

            if (task.widget) {
                Log.Info("Issuing sentinel");
                automaton.issueTargetOrder(OrderId.Sentinel, task.widget);
            } else {
                Log.Info("Stopping the task");
                this.StopAutomationTask(automaton);
            }
            return null;
        }
    }

    private FilterItemsTooltip = () =>
`Configured to filter items as follows:

`;
}

export interface AutomatonState {

    Update(automaton: Unit, task: AutomatonTask): AutomatonState | null;
}