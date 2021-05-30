import { MapPlayer, Rectangle, Region, Timer, Trigger, Unit } from "w3ts/index";
import { AttackAnchorState } from "./states/AttackAnchorState";

enum EnemyTypes {
    Footman         = FourCC('h005'),

}

export class AiController {

    private units: Set<number> = new Set();
    private states: AiState[] = [];
    private aiTimer: Timer;

    constructor(aiRect: Rectangle, private readonly enemyPlayer: MapPlayer) {
        
        let aiRegion = new Region();
        aiRegion.addRect(aiRect);

        const unitEntersTrg = new Trigger();
        unitEntersTrg.registerEnterRegion(aiRegion.handle, null);
        unitEntersTrg.addAction(() => this.OnUnitEnter());

        const unitDiesTrg = new Trigger();
        unitDiesTrg.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
        unitDiesTrg.addAction(() => this.OnUnitDeath());

        this.aiTimer = new Timer();
        this.aiTimer.start(3, true, () => this.UpdateUnits());
    }

    UpdateUnits(): void {
        
        let count = this.states.length;
        for (let i = 0; i < count; i++) {

            let state = this.states[i];
            let remains = state.Update();
            if (remains == false) {

                let last = this.states.pop();
                if (i < count - 1 && last)
                    this.states[i] = last;
            }
        }
    }

    public Register(state: AiState) {

        const unitId = state.unit.id;
        if (this.units.has(unitId)) {
            return;
        }
        this.states.push(state);
        this.units.add(unitId);

        // this.aiTimer.start(1, true, () => this.UpdateUnits());
    }

    /**
     * Method that should be trashed
     */
    private OnUnitEnter(): void {
        
        let unit = Unit.fromEvent();
        if (unit.owner.id != this.enemyPlayer.id) return;

        switch (unit.typeId) {
            case EnemyTypes.Footman:
                this.Register(new AttackAnchorState(unit));
                break;
        }
    }

    /**
     * Method that should be trashed
     */
    OnUnitDeath(): void {
        
        const unit = Unit.fromEvent();
        const unitId = unit.id;
        if (this.units.has(unitId) == false) return;

        this.units.delete(unitId);
    }
}

export interface AiState {

    unit: Unit;

    Update(): boolean;
}