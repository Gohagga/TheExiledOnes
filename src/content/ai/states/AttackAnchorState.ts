import { Global } from "config/Config";
import { OrderId } from "w3ts/globals/order";
import { Unit } from "w3ts/index";
import { AiState } from "../AiController";

export class AttackAnchorState implements AiState {
    
    unit: Unit;
    attackedTarget: Unit;

    constructor(unit: Unit) {
        this.unit = unit;
        this.attackedTarget = Global.soulAnchor;
        this.unit.removeGuardPosition();
        this.unit.issuePointOrder(OrderId.Attack, this.attackedTarget.point);
    }
    
    Update(): boolean {
        
        if (this.unit.isAlive() == false) return false;

        if (this.unit.currentOrder == 0) {
            this.unit.issuePointOrder(OrderId.Attack, this.attackedTarget.point);
        }

        return true;
    }
}