import { HeroManager } from "content/gameplay/HeroManager";
import { Log } from "Log";
import { IQuestEventHandler, QuestEvent } from "systems/events/quests/IQuestEventHandler";
import { IQuest } from "systems/quests/IQuest";
import { QuestManager } from "systems/quests/QuestManager";
import { MapPlayer, Trigger } from "w3ts/index";
import { IQuestView } from "./IQuestView";

export class QuestViewModel {

    private quests: IQuest[] = [];
    
    constructor(
        private readonly view: IQuestView,
        private readonly questEvent: IQuestEventHandler,
        private readonly questManager: QuestManager,
        private readonly heroManager: HeroManager,
    ) {
        
        for (let i = 0; i < view.questSlots.length; i++) {
            let index = i;
            let slot = view.questSlots[index];
            
            let trg = new Trigger();
            trg.triggerRegisterFrameEvent(slot.buttonClaim, FRAMEEVENT_CONTROL_CLICK);
            trg.addAction(() => this.OnClaimClick(index));
        }

        this.questEvent.OnQuestUpdated((e: QuestEvent) => this.OnQuestUpdated(e));
        this.questEvent.OnQuestClaimed((e: QuestEvent) => this.OnQuestClaimed(e));
        // this.questEvent.OnQuestCompleted((e: QuestEvent) => this.OnQuestCompleted(e));

        try {
            for (let i = 0; i < 4; i++) {
                let q = this.questManager.GetNextQuest();
                if (q) this.quests[i] = q;
                this.RenderQuestSlot(i);
            }
        } catch (e) {
        }
    }

    OnQuestUpdated(e: QuestEvent): void {
        Log.Debug("VM OnQuestUpdated")
        let index = this.GetQuestIndex(e.quest);
        if (index == -1) return;

        // Redraw slot index
        this.RenderQuestSlot(index);
    }

    OnQuestCompleted(e: QuestEvent): void {
        Log.Debug("VM OnQuestCompleted")
        let index = this.GetQuestIndex(e.quest);
        if (index == -1) return;

        // Redraw slot index
        this.RenderQuestSlot(index);
    }

    OnQuestClaimed(e: QuestEvent): void {
        
        Log.Debug("VM OnQuestClaimed")
        let index = this.GetQuestIndex(e.quest);
        Log.Debug(index);
        if (index == -1) return;
        
        let nextQuest = this.questManager.GetNextQuest();
        
        if (!nextQuest) {

            let last = this.quests.pop();
            if (last && e.quest != last) {
                this.quests[index] = last;
            }
            this.RenderQuestSlot(this.quests.length);
        } else {
            this.quests[index] = nextQuest;
        }

        // Redraw slot index
        this.RenderQuestSlot(index);
    }

    OnClaimClick(slotIndex: number) {

        Log.Debug("VM OnClaimClick")
        let owner = MapPlayer.fromEvent();
        let hero = this.heroManager.playerHero.get(owner.id);
        
        // Player cannot claim a quest reward if he has no hero.
        if (!hero) return;

        this.questManager.ClaimQuest(hero, this.quests[slotIndex]);
    }

    private RenderQuestSlot(index: number) {

        if (index > this.view.questSlots.length) return;
        let quest = this.quests[index];
        
        let v = this.view.questSlots[index];
        if (!quest) {
            // v.buttonClaim.visible = false;
            // v.progressText.visible = false;
            // v.text.text = '';
            v.box.visible = false;
            return;
        }

        let isCompleted = quest.IsCompleted();
        v.buttonClaim.visible = isCompleted;
        v.progressText.visible = !isCompleted;
        
        v.text.text = quest.text;
        v.progressText.text = quest.ProgressDisplay();
        quest.isActive = true;
    }

    private GetQuestIndex(quest: IQuest) {
        // Find the quest in the GUI and replace it
        let index = -1;
        for (let i = 0; i < this.quests.length; i++) {
            if (this.quests[i] == quest) {
                index = i;
                Log.Debug("Found quest index")
                break;
            }
        }
        return index;
    }
    
}