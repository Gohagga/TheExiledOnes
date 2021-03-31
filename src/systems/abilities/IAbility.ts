import { Unit } from "w3ts/index";
import { Wc3Ability } from "./Wc3Ability";

export interface IAbility {

    id: number;

    extId?: number;

    AddToUnit(unit: Unit, extended?: boolean): boolean;

    RemoveFromUnit(unit: Unit, extended?: boolean): boolean;
}