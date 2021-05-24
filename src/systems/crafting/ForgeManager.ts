import { Log } from "Log";
import { IEnumUnitService } from "services/enum-service/IEnumUnitService";
import { Effect, Point, TextTag, Timer, Unit } from "w3ts/index";

export interface Forge {
    temperature: number,
    timer: Timer,
    level: number,
    tag: TextTag,
    isRaiseOn: boolean,
    isMaintainOn: boolean,
    sfx: Effect,
}

export class ForgeManager {

    private instances: Record<number, Forge> = {};

    constructor(
        private readonly forgeAura: number,
        private readonly enumUnitService: IEnumUnitService
    ) {
        
    }

    public GetNearbyForges(point: Point): Unit[] {

        let forges = this.enumUnitService.EnumUnitsInRange(point, 300, (target) =>
            target.getAbilityLevel(this.forgeAura) > 0);

        return forges;
    }

    public GetHighestTemperatureForge(units: Unit[], minTemp: number): Forge | null {

        if (units.length == 0) return null;

        let chosen: Forge | null = null;
        for (let u of units) {
            let forge = this.instances[u.id];
            if (forge && forge.temperature >= minTemp) {
                chosen = forge;
                minTemp = forge.temperature;
            }
        }

        return chosen;
    }

    private PeriodicUpdate(unit: Unit) {
        
        let unitId = unit.id;
        if (unitId in this.instances) {
            
            let instance = this.instances[unitId];

            // 0        - 0
            // 50%      - 1
            // 100%     = 0


            // 10 / 100 = 0.1
            // 60 / 100 = 0.6
            
            // 0.5 - math.abs(0.5 - x / 100)
            // 0.1 = 0.4 = 0.1
            // 0.4 = 0.1 = 0.4
            // 0.5 = 0   = 0.5
            // 0.6 = 0.1 = 0.4
            // 0.9 = 0.4 = 0.1

            // 2 * (m) + 0.1
            // 0.3
            // 0.9
            // 1.1
            // 0.9
            // 0.3
            let perc = math.abs(0.5 - instance.temperature / instance.level);
            let multiplier = 2 * (0.5 - perc);
            let delta = 1 * (1 + 10 * multiplier);

            Log.Info(perc, multiplier, delta);
            
            if (instance.isRaiseOn) {
                Log.Info("raise on");
                instance.temperature += delta;
                instance.sfx.scale = 1;
                instance.sfx.setAlpha(255);
                if (instance.temperature > instance.level)
                    instance.temperature = instance.level;
            }
            else if (instance.isMaintainOn && unit.mana >= 1) {

                Log.Info("raise off, maintain on");
                instance.temperature += (math.random() - 0.5) * delta * 0.5;
                instance.sfx.scale = 1;
                instance.sfx.setAlpha(128);
                if (instance.temperature > instance.level)
                    instance.temperature = instance.level;

                unit.mana -= 0.3;
            }
            else {

                Log.Info("Off");
                instance.sfx.scale = 0;
                instance.sfx.setAlpha(0);
                instance.temperature -= delta;

                if (instance.temperature <= 0) {
                    // Turn it off
                    instance.tag.destroy();
                    instance.timer.destroy();
                    delete this.instances[unitId];
                }
            }

            let text = string.format('%.0f', math.max(instance.temperature, 0));
            SetTextTagTextBJ(instance.tag.handle, text, 20);
        }
    }

    public TurnRaiseOn(forgeUnit: Unit) {
        
        let unitId = forgeUnit.id;
        let instance: Forge;

        if (unitId in this.instances) {
            instance = this.instances[unitId];
            instance.isRaiseOn = true;
            instance.sfx.scale = 1;
            instance.sfx.setAlpha(255);
        } else {
            
            let tt = CreateTextTagUnitBJ('', forgeUnit.handle, 35, 20, 50, 255, 60, 100);
            instance = this.instances[unitId] = {
                temperature: 0,
                timer: new Timer(),
                level: 150,
                isRaiseOn: true,
                isMaintainOn: false,
                tag: TextTag.fromHandle(tt),
                sfx: new Effect('Abilities\\Spells\\NightElf\\Immolation\\ImmolationTarget.mdl', forgeUnit.x, forgeUnit.y)
            };
        }

        instance.timer.pause();
        instance.timer.start(1, true, () => this.PeriodicUpdate(forgeUnit));
    }

    public TurnRaiseOff(forgeUnit: Unit) {
        let unitId = forgeUnit.id;
        let instance: Forge;

        if (unitId in this.instances) {
            instance = this.instances[unitId];
            instance.isRaiseOn = false;
        }
    }

    public TurnMaintainOn(forgeUnit: Unit) {
        let unitId = forgeUnit.id;
        let instance: Forge;

        if (unitId in this.instances) {
            instance = this.instances[unitId];
            instance.isMaintainOn = true;
            instance.sfx.scale = 1;
            instance.sfx.setAlpha(255);

            instance
        } else {
            
            let tt = CreateTextTagUnitBJ('', forgeUnit.handle, 35, 20, 50, 255, 60, 100);
            instance = this.instances[unitId] = {
                temperature: 0,
                timer: new Timer(),
                level: 150,
                isMaintainOn: true,
                isRaiseOn: false,
                tag: TextTag.fromHandle(tt),
                sfx: new Effect('Abilities\\Spells\\NightElf\\Immolation\\ImmolationTarget.mdl', forgeUnit.x, forgeUnit.y)
            };
        }

        instance.timer.pause();
        instance.timer.start(1, true, () => this.PeriodicUpdate(forgeUnit));
    }

    public TurnMaintainOff(forgeUnit: Unit) {
        let unitId = forgeUnit.id;
        let instance: Forge;

        if (unitId in this.instances) {
            instance = this.instances[unitId];
            instance.isMaintainOn = false;
        }
    }
}