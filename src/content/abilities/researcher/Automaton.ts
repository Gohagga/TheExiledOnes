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
import { Destructable, Rectangle, Trigger, Unit, Widget } from "w3ts/index";
import { Hand } from "../tools/Hand";

export class Automaton extends BuildingAbilityBase {

    private instance: Record<number, { state: AutomatonState, object: Widget }> = {};

    private findDestructablesRect: Rectangle;

    constructor(
        data: Wc3BuildingAbility,
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
            
        abilityEvent.OnAbilityEffect(this.buildId, (e: AbilityEvent) => this.Execute(e));

        this.findDestructablesRect = new Rectangle(0, 0, 512, 512);

        let finishBuilding = new Trigger();
        finishBuilding.registerAnyUnitEvent(EVENT_PLAYER_UNIT_CONSTRUCT_FINISH);
        finishBuilding.addAction(() => this.OnUnitBuilt());

    }

    Execute(e: AbilityEvent): void {
        
        this.OnBuild(e.caster);
    }

    OnUnitBuilt(): void {
        
        let unit = Unit.fromEvent();
        if (unit.typeId != this.builtUnitId) return;

        this.toolManager.SetDefault(unit, this.hand);
    }

    private ReturnState: AutomatonState = {
        Update: (automaton: Unit) => {
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
        }
    }

    private HandNearbyTrees: AutomatonState = {
        Update: (automaton: Unit) => {
            
            let { x, y } = automaton;
            this.findDestructablesRect.move(x, y);
            
            let dest: Destructable[] = [];
            EnumDestructablesInRect(this.findDestructablesRect.handle, null, () => {
                dest.push(Destructable.fromHandle(GetEnumDestructable()));
            });

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
                automaton.issueTargetOrder(OrderId.Sentinel, closest);
            }
        }
    }
}

export interface AutomatonState {

    Update(automaton: Unit): void;
}