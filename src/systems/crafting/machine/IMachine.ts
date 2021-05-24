import { Item, MapPlayer, Unit } from "w3ts/index";

export interface IMachine {

    unit: Unit;

    // Order(unit: Unit, item: Item): void;
    QueueUnit(unit: Unit, queuedTypeId: number): void;
    Start(unit: Unit, startId: number): void;
    Cancel(unit: Unit, canceledId: number): void;
    Finish(unit: Unit, finishId: number, finishUnit: Unit): void;
    Attack(unit: Unit, attacker: Unit): void;
}