import { EventBusHandler } from "../generic/EventBusHandler";
import { IQuestEventHandler, QuestEvent, QuestEventType } from "./IQuestEventHandler";

export class QuestEventHandler implements IQuestEventHandler {

    private readonly handles: Record<QuestEventType, EventBusHandler<(e: any) => void>> = {
        [QuestEventType.Started]: new EventBusHandler<(e: QuestEvent) => void>(),
        [QuestEventType.Updated]: new EventBusHandler<(e: QuestEvent) => void>(),
        [QuestEventType.Completed]: new EventBusHandler<(e: QuestEvent) => void>(),
        [QuestEventType.Claimed]: new EventBusHandler<(e: QuestEvent) => void>(),
    }

    public Unsubscribe(type: QuestEventType, id: number) {
        this.handles[type].Unsubscribe(id);
    }

    public Subscribe(type: QuestEventType, callback: (e: QuestEvent) => void) {
        return this.handles[type].Subscribe(callback);
    }

    public OnQuestStarted(callback: (e: QuestEvent) => void) {
        return this.Subscribe(QuestEventType.Started, callback);
    }

    public OnQuestUpdated(callback: (e: QuestEvent) => void) {
        return this.Subscribe(QuestEventType.Updated, callback);
    }

    public OnQuestClaimed(callback: (e: QuestEvent) => void) {
        return this.Subscribe(QuestEventType.Claimed, callback);
    }

    public OnQuestCompleted(callback: (e: QuestEvent) => void) {
        return this.Subscribe(QuestEventType.Completed, callback);
    }

    public Raise(type: QuestEventType, eventModel: QuestEvent) {
        let event: any;

        let subs = this.handles[type].Subscriptions.values();
        for (let sub of subs) {
            sub(eventModel);
        }
    }
}