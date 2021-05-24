import { Log } from "Log";
import { ErrorService } from "systems/ui/ErrorService";
import { Destructable, MapPlayer, Trigger } from "w3ts/index";

export enum TreeType {
    SummerTreeWall = FourCC('LTlt'),
}

export class ResourceDropManager {

    private readonly treeAliveTable: Record<number, boolean> = {};

    private readonly treeTrigger: Trigger;
    private readonly attackTreeTrigger: Trigger;

    constructor() {
        
        this.treeTrigger = new Trigger();
        this.attackTreeTrigger = new Trigger();

        this.attackTreeTrigger.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER);
        this.attackTreeTrigger.addAction(() => {
            
            let dest = GetOrderTargetDestructable();
            if (GetDestructableTypeId(dest) == TreeType.SummerTreeWall) {
                let id = GetHandleId(dest);
                if (id in this.treeAliveTable == false) {

                    TriggerRegisterDeathEvent(this.treeTrigger.handle, dest);
                    this.treeAliveTable[id] = true;
                }
            }
        });
        
        this.treeTrigger.addAction(() => {
            
            let dest = Destructable.fromEvent();
            let id = dest.id;

            // If tree is alive
            if (this.treeAliveTable[id]) {
                this.treeAliveTable[id] = false;

                let killer = GetKillingUnit();
                Log.Info(GetUnitName(killer), "killing unit");
                let triggerUnit = GetTriggerUnit();
                Log.Info(GetUnitName(triggerUnit), "trigger unit");
                
            }
        });
    }

    registerTreeDrops(destr: destructable) {
        TriggerRegisterDeathEvent(this.treeTrigger.handle, destr);
        this.treeAliveTable[GetHandleId(destr)] = true;
    }
}