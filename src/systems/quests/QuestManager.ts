import { IQuestEventHandler, QuestEventType } from "systems/events/quests/IQuestEventHandler";
import { Unit } from "w3ts/index";
import { IQuest } from "./IQuest";

export class QuestManager {

    private questPool: IQuest[] = [];

    constructor(
        private readonly questEvent: IQuestEventHandler,
    ) {

    }

    AddQuestToPool(quest: IQuest) {
        this.questPool.push(quest);
    }

    UpdateQuest(quest: IQuest) {

        this.questEvent .Raise(QuestEventType.Updated, {
            quest
        });

        if (quest.IsCompleted())
        {
            this.questEvent.Raise(QuestEventType.Completed, {
                quest
            });
        }
    }

    ClaimQuest(unit: Unit, quest: IQuest) {
        quest.ClaimReward(unit);
        this.questEvent.Raise(QuestEventType.Claimed, {
            quest
        });
    }

    GetNextQuest(): IQuest | null {
        let q = this.questPool.shift();
        return q || null;
    }
}