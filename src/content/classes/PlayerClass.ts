import { Log } from "Log";
import { Trigger, Unit } from "w3ts/handles/index";

export abstract class PlayerClass {
        
    protected levelUpTrigger: Trigger;
    protected levelUpgrade: number = FourCC('RL00');
    
    protected abstract unit: Unit;
    protected thread: LuaThread;

    constructor(
        unit: Unit
    ) {
        this.levelUpTrigger = new Trigger();
        this.levelUpTrigger.registerUnitEvent(unit, EVENT_UNIT_HERO_LEVEL);
        this.levelUpTrigger.addAction(() => {
            coroutine.resume(this.thread);
        });
        this.thread = coroutine.create(() => this.Progress());
    }

    public Start() {
        // if (this.thread && coroutine.status(this.thread) == 'running') coroutine.yield(this.thread);
        // this.thread = coroutine.create(() => this.progress());
        coroutine.resume(this.thread);
    }

    public  WaitForUnitLevel(level: number) {
        while (this.unit.level < level) {
            coroutine.yield();
        }
    }

    protected abstract Progress(): void;
}