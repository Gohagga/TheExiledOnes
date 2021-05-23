import { Log } from "Log";
import { Item, Trigger } from "w3ts/index";
import { Quest } from "./Quest";
import { QuestManager } from "./QuestManager";

export class ItemQuest extends Quest {

    private collectedItems: Set<number> = new Set<number>();

    constructor(
        codeId: string,
        text: string,
        private readonly questManager: QuestManager,
        private readonly itemTypeId: number,
        private readonly itemAmount: number,
    ) {
        super(codeId, text);

        let itemPickupTrg = new Trigger();
        itemPickupTrg.registerAnyUnitEvent(EVENT_PLAYER_UNIT_PICKUP_ITEM);
        itemPickupTrg.addAction(() => this.OnPickup());
    }

    OnPickup(): void {

        Log.Debug("is active", this.isActive)
        if (this.isActive == false) return;
        
        
        let item = Item.fromEvent();
        Log.Debug("itemtype", GetObjectName(item.typeId));

        if (item.typeId != this.itemTypeId) return;
        Log.Debug("has item", this.collectedItems.has(item.id));

        if (this.collectedItems.has(item.id))
            return;
        
            Log.Debug(4)

        this.collectedItems.add(item.id);
        this.questManager.UpdateQuest(this);
        Log.Debug(5)

    }

    IsCompleted() {
        return this.collectedItems.size >= this.itemAmount;
    }

    ProgressDisplay(): string {
        return this.collectedItems.size + '/' + this.itemAmount;
    }
}