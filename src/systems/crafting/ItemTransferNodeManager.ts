import { FlyingItemsManager } from "systems/flying-items/FlyingItemsManager";
import { Item, Timer, Trigger, Unit } from "w3ts";

export interface ItemTransferNodeConfig {
    nodeTypeCode: string,
    nodeCooldown: number,
    nodeTargetAbilityCode: string,
    teleportSfx: string,
}

const PERIOD = 1;

export class ItemTransferNodeManager {

    private activeNodes: Unit[] = [];
    private cooldown: Record<number, number> = {};
    
    private nodeTypeId: number;
    private nodeCooldown: number;
    private nodeTargetAbilityId: number;
    private teleportSfx: string;

    constructor(
        private config: ItemTransferNodeConfig,
        private readonly flyingItemsManager: FlyingItemsManager
    ) {
        this.nodeTypeId = FourCC(config.nodeTypeCode);
        this.nodeCooldown = config.nodeCooldown;
        this.nodeTargetAbilityId = FourCC(config.nodeTargetAbilityCode);
        this.teleportSfx = config.teleportSfx;
        
        new Timer().start(PERIOD, true, () => this.Update());

        let t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_PICKUP_ITEM);
        t.addAction(() => {
            let unit = Unit.fromEvent();
            let item = Item.fromEvent();
            if (unit.typeId == this.nodeTypeId) {

                // print("Bouncing...");

                this.TryLaunchItem(unit, item);
            }
        });
    }

    Register(unit: Unit) {
        this.activeNodes.push(unit);
    }

    TryLaunchItem(node: Unit, item: Item): boolean {

        // Check for Rally etc
        let rallyUnit = GetUnitRallyUnit(node.handle);
        if (!rallyUnit) return false;

        let targetUnit = Unit.fromHandle(rallyUnit);
        if (targetUnit.getAbilityLevel(this.nodeTargetAbilityId) < 1)
            return false;

        let uid = node.id;
        if (this.cooldown[uid] > 0) return false;
        this.cooldown[uid] = this.nodeCooldown;

        DestroyEffect(AddSpecialEffect(this.teleportSfx, item.x, item.y));
        this.flyingItemsManager.Register(node, item, targetUnit);

        return true;
    }

    Update() {

        for (let i = 0; i < this.activeNodes.length; i++) {

            let u = this.activeNodes[i];
            let uid = u.id;
            let remains = u.isAlive();
            if (remains == false) {
                let last = this.activeNodes.pop();
                if (i < this.activeNodes.length && last)
                    this.activeNodes[i] = last;
                
                delete this.cooldown[uid];
                continue;
            }

            // Logic
            let it: item;
            this.cooldown[uid] ||= 0;
            this.cooldown[uid] -= PERIOD;
            // print(this.cooldown[uid]);
            for (let i = 5; i >= 0; i--) {
                it = UnitItemInSlot(u.handle, i);
                if (it) {
                    this.TryLaunchItem(u, Item.fromHandle(it));
                    break;
                }
            }
        }
    }
}