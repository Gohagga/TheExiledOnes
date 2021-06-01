import { MapPlayer, Point, Rectangle, Region, Timer, Trigger, Unit } from "w3ts/index";
import { AttackAnchorState } from "./states/AttackAnchorState";

enum EnemyTypes {
    Footman         = FourCC('h005'),

}

export class AiController {

    private units: Set<number> = new Set();
    private states: AiState[] = [];
    private aiTimer: Timer;

    public enemiesSpawnedPerWave = 2;
    public enemiesSpawnInc = 1;
    public nextSpawnTime: number;

    constructor(
        aiRect: Rectangle,
        private readonly enemyPlayer: MapPlayer, 
        private readonly potentialSpawnPoints: { x: number, y: number }[], 
        private readonly players: MapPlayer[]
    ) {
        
        let aiRegion = new Region();
        aiRegion.addRect(aiRect);

        const unitEntersTrg = new Trigger();
        unitEntersTrg.registerEnterRegion(aiRegion.handle, null);
        unitEntersTrg.addAction(() => this.OnUnitEnter());

        const unitDiesTrg = new Trigger();
        unitDiesTrg.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
        unitDiesTrg.addAction(() => this.OnUnitDeath());

        this.nextSpawnTime = 0;
        const gateTimerTrg = new Trigger();
        gateTimerTrg.registerGameStateEvent(GAME_STATE_TIME_OF_DAY, EQUAL, 7.0);
        gateTimerTrg.addAction(() => this.OnNewDay());

        this.aiTimer = new Timer();
        this.aiTimer.start(3, true, () => this.UpdateUnits());

    }

    OnNewDay(): void {
        this.nextSpawnTime = math.random(0, 8);
        let tim = new Timer();
        tim.start(this.nextSpawnTime * 20, false, () => {
            
            let activePlayers = 0;
            for (let p of this.players) {
                if (p.slotState == PLAYER_SLOT_STATE_PLAYING)
                    activePlayers++;
            }
            let unitCount = this.enemiesSpawnedPerWave * activePlayers;
            this.enemiesSpawnedPerWave += this.enemiesSpawnInc;
            
            let timer = new Timer();
            let spawnPoint = this.potentialSpawnPoints[math.random(0, this.potentialSpawnPoints.length - 1)];
            let portal = new Unit(this.enemyPlayer, FourCC('h006'), spawnPoint.x, spawnPoint.y, 270);
            portal.setAnimation('birth');
            timer.start(5, false, () => {

                timer.start(1, true, () => {
        
                    // Create enemy unit and order them to attack position of soul anchor
                    // let u = new Unit(enemyPlayer, FourCC('h005'), e.targetPoint.x, e.targetPoint.y, 0);
                    portal.issueImmediateOrder(FourCC('h005'));
                    if (--unitCount == 0) {
                        timer.destroy();
                        portal.applyTimedLife(FourCC('B000'), 2);
                    }
                });
            });
            tim.destroy();
        });
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