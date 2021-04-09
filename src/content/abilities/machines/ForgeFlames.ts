import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { OrderId } from "w3ts/globals/order";
import { Effect, TextTag, Timer, Trigger, Unit } from "w3ts/index";

export interface Forge {
    temperature: number,
    timer: Timer,
    level: number,
    tag: TextTag,
    isOn: boolean,
    sfx: Effect,
}

export class ForgeFlames extends AbilityBase {

    private instances: Record<number, Forge> = {};
    
    constructor(
        data: Wc3Ability,
        abilityEvent: IAbilityEventHandler
    ) {
        super(data);

        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.ToggledOn(e));

        let t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_ORDER);
        t.addAction(() => 
            GetIssuedOrderId() == OrderId.Unimmolation
            ? this.ToggledOff()
            : null);
    }

    PeriodicUpdate(unit: Unit) {
        
        let unitId = unit.id;
        if (unitId in this.instances) {
            
            let instance = this.instances[unitId];
            let delta = 1 * (1 + 10 * instance.temperature / instance.level);
            
            if (instance.isOn) {
                instance.temperature += delta;
                if (instance.temperature > instance.level)
                    instance.temperature = instance.level;
            } else {

                if (instance.temperature <= 0) {
                    // Turn it off
                    instance.tag.destroy();
                    instance.timer.destroy();
                    delete this.instances[unitId];
                } else {
                    instance.temperature -= delta;
                }
            }

            let text = string.format('%.0f', instance.temperature);
            SetTextTagTextBJ(instance.tag.handle, text, 20);
        }
    }
    
    ToggledOn(e: AbilityEvent): void {
        
        let caster = e.caster;
        let unitId = caster.id;
        let instance: Forge;

        if (unitId in this.instances) {
            instance = this.instances[unitId];
            instance.isOn = true;
            instance.sfx.scale = 1;
            instance.sfx.setAlpha(255);
        } else {
            
            let tt = CreateTextTagUnitBJ('', caster.handle, 35, 20, 50, 255, 60, 100);
            instance = this.instances[unitId] = {
                temperature: 0,
                timer: new Timer(),
                level: 150,
                isOn: true,
                tag: TextTag.fromHandle(tt),
                sfx: new Effect('Abilities\\Spells\\NightElf\\Immolation\\ImmolationTarget.mdl', caster.x, caster.y)
            };
        }

        instance.timer.pause();
        instance.timer.start(1, true, () => this.PeriodicUpdate(caster));
    }

    ToggledOff(): void {

        let caster = Unit.fromEvent();
        let unitId = caster.id;
        let instance: Forge;

        if (unitId in this.instances) {
            instance = this.instances[unitId];
            instance.isOn = false;
            instance.sfx.scale = 0;
            instance.sfx.setAlpha(0);
        }
    }
    
    TooltipDescription = undefined;
}