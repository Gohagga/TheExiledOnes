import { Destructable, Point, Unit } from "w3ts/index";

export class AbilityEvent {

    public get caster(): Unit { return Unit.fromEvent(); }
    public get targetUnit(): Unit { return Unit.fromHandle(GetSpellTargetUnit()); }
    public get targetDestructable(): Destructable { return Destructable.fromHandle(GetSpellTargetDestructable()); }
    public get targetPoint(): Point { return Point.fromHandle(GetSpellTargetLoc()); }
    public get abilityId(): number { return GetSpellAbilityId(); }
    public get abilityLevel(): number { return GetUnitAbilityLevel(GetTriggerUnit(), GetSpellAbilityId()); }
    public get summonedUnit(): Unit { return Unit.fromHandle(GetSummonedUnit()); }
}
