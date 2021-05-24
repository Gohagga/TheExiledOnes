import { IAbility } from "systems/abilities/IAbility";
import { Unit } from "w3ts/handles/unit";

export interface IToolAbility extends IAbility {

    SetLevel(unit: Unit, level: number): boolean;
}