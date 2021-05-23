import { IQuest } from "systems/quests/IQuest";

export interface IQuestEventHandler {

    Unsubscribe(type: QuestEventType, id: number): void;

    Subscribe(type: QuestEventType, callback: (e: QuestEvent) => void): number;

    OnQuestStarted(callback: (e: QuestEvent) => void): number;

    OnQuestUpdated(callback: (e: QuestEvent) => void): number;

    OnQuestClaimed(callback: (e: QuestEvent) => void): number;

    OnQuestCompleted(callback: (e: QuestEvent) => void): number;

    Raise(type: QuestEventType, eventModel: QuestEvent): void;
}

export enum QuestEventType {
    Started,
    Updated,
    Completed,
    Claimed
}

export interface QuestEvent {
    quest: IQuest
}