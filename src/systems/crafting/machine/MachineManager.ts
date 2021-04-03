import { Item, MapPlayer, Trigger, Unit } from "w3ts/index";
import { IMachine } from "./IMachine";
import { MachineBase } from "./Machine";
import { OrderId } from "w3ts/globals/order";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { Log } from "Log";

enum MachineEvent {
    Order,
    TrainQueued,
    TrainStart,
    TrainCancel,
    TrainFinish,
    Attacked
}

export class MachineManager {

    private instance: Record<number, IMachine> = {};

    constructor(abilityEvent: IAbilityEventHandler) {
        

        // abilityEvent.OnAbilityEffect(FourCC('AR00'), () => this.ExecuteOrder(0));
        // abilityEvent.OnAbilityEffect(FourCC('AR01'), () => this.ExecuteOrder(1));
        // abilityEvent.OnAbilityEffect(FourCC('AR02'), () => this.ExecuteOrder(2));
        // abilityEvent.OnAbilityEffect(FourCC('AR03'), () => this.ExecuteOrder(3));
        // abilityEvent.OnAbilityEffect(FourCC('AR04'), () => this.ExecuteOrder(4));
        // abilityEvent.OnAbilityEffect(FourCC('AR05'), () => this.ExecuteOrder(5));
        // abilityEvent.OnAbilityEffect(FourCC('AR06'), () => this.ExecuteOrder(6));
        // abilityEvent.OnAbilityEffect(FourCC('AR07'), () => this.ExecuteOrder(7));
        // abilityEvent.OnAbilityEffect(FourCC('AR08'), () => this.ExecuteOrder(8));
        // abilityEvent.OnAbilityEffect(FourCC('AR09'), () => this.ExecuteOrder(9));
        // abilityEvent.OnAbilityEffect(FourCC('AR10'), () => this.ExecuteOrder(10));
        // abilityEvent.OnAbilityEffect(FourCC('AR11'), () => this.ExecuteOrder(11));
        
        
        let t = new Trigger();
        // t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SELL);
        // t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SELL_ITEM);
        // t.addAction(() => {
        //     print("sell item", Unit.fromEvent().name);
        //     this.ExecuteEvent(MachineEvent.Order)
        // });

        t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_ORDER);
        t.addAction(() => this.ExecuteEvent(MachineEvent.TrainQueued));

        t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_TRAIN_START)
        t.addAction(() => this.ExecuteEvent(MachineEvent.TrainStart));
        
        t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_TRAIN_CANCEL)
        t.addAction(() => this.ExecuteEvent(MachineEvent.TrainCancel));

        t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_TRAIN_FINISH)
        t.addAction(() => this.ExecuteEvent(MachineEvent.TrainFinish));

        t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DAMAGED);
        t.addAction(() => this.ExecuteEvent(MachineEvent.Attacked));
    }

    // ExecuteOrder(orderId: number): void {
    //     let unit = Unit.fromEvent();
    //     let id = unit.id;
    //     if (id in this.instance) {
    //         this.instance[id].Order(unit, orderId);
    //     }
    // }

    ExecuteEvent(event: MachineEvent)  {
        let unit: Unit;
        if (event == MachineEvent.Attacked) unit = Unit.fromHandle(BlzGetEventDamageTarget());
        else unit = Unit.fromEvent();

        let id = unit.id;
        if (id in this.instance) {
            switch (event) {
                case MachineEvent.TrainQueued:
                    return (GetIssuedOrderId() != OrderId.Cancel) &&
                        this.instance[id].QueueUnit(unit, GetIssuedOrderId());
                case MachineEvent.TrainStart:
                    return this.instance[id].Start(unit, GetTrainedUnitType());
                case MachineEvent.TrainCancel:
                    return this.instance[id].Cancel(unit, GetTrainedUnitType());
                case MachineEvent.TrainFinish:
                    return this.instance[id].Finish(unit, GetTrainedUnitType(), Unit.fromHandle(GetTrainedUnit()));
                case MachineEvent.Attacked:
                    return this.instance[id].Attack(unit, Unit.fromHandle(GetEventDamageSource()));
                // case MachineEvent.Order:
                //     return this.instance[id].Order(unit, Item.fromHandle(GetSoldItem()));
            }
        }
    }

    Register(machine: IMachine) {
        this.instance[machine.unit.id] = machine;
    }
}