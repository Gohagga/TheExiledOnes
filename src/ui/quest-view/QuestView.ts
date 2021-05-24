import { Log } from "Log";
import { Frame } from "w3ts/index";
import { IQuestSlotView, IQuestView } from "./IQuestView";

export function CreateQuestView(parent: Frame): IQuestView {

    const box = new Frame("ListBoxWar3", parent, 0, 0);
    const title = Frame.fromHandle(BlzCreateFrameByType("TEXT", "StandardInfoTextTemplate", parent.handle, "StandardInfoTextTemplate", 0));

    const x = 0;
    // const x = 0.05;
    const y = 0.32;
    // const y = 0.54;
    const height = 0.13;
    const width = 0.18;

    box
        .clearPoints()
        .setAbsPoint(FRAMEPOINT_TOPLEFT, x, y)
        .setSize(width, height);

    title
        .clearPoints()
        .setPoint(FRAMEPOINT_TOPLEFT, box, FRAMEPOINT_TOPLEFT, 0, 0.01)
        .setScale(1.5)
        .text = "Quests";

    const view: IQuestView = {
        questSlots: []
    };

    const count = 4;
    let itemHeight = height / count;
    for (let i = 0; i < count; i++) {
        let index = i;
        view.questSlots.push(CreateQuestSlotView(box, index, itemHeight, x, y));
    }

    return view;
}

function CreateQuestSlotView(parent: Frame, i: number, height: number, boxX: number, boxY: number) {
    
    const box = new Frame("ListBoxWar3", parent, 0, 0);
    const text = Frame.fromHandle(BlzCreateFrameByType("TEXT", "StandardInfoTextTemplate", box.handle, "StandardInfoTextTemplate", 0));
    const progressText = Frame.fromHandle(BlzCreateFrameByType("TEXT", "StandardInfoTextTemplate", box.handle, "StandardInfoTextTemplate", 0));

    let x = boxX;
    let y = boxY - i * height;

    Log.Debug("CREATING SOMETHINGS", y)
    // x = 0;
    // y = 0;
    box
        .setAbsPoint(FRAMEPOINT_TOPLEFT, x, y)
        .setSize(parent.width, height * 1.08);

    text
        .clearPoints()
        .setPoint(FRAMEPOINT_TOPLEFT, box, FRAMEPOINT_TOPLEFT, 0.01, -0.01)
        .setPoint(FRAMEPOINT_BOTTOMRIGHT, box, FRAMEPOINT_BOTTOMRIGHT, -0.01, 0.01)
        .text = "Text title";

    BlzFrameSetTextAlignment(text.handle, TEXT_JUSTIFY_CENTER, TEXT_JUSTIFY_LEFT);

    const buttonClaim = new Frame("ScriptDialogButton", box, 0, 0);
    const buttonClaimText = Frame.fromName("ScriptDialogButtonText", 0);

    buttonClaim
        .setPoint(FRAMEPOINT_RIGHT, box, FRAMEPOINT_RIGHT, 0, 0)
        .setSize(0.05, 0.032)
        .text = "Claim";

    progressText
        .clearPoints()
        .setPoint(FRAMEPOINT_RIGHT, box, FRAMEPOINT_RIGHT, -0.01, 0)
        .setSize(0.05, 0.032)
        .text = "0/0";

    BlzFrameSetTextAlignment(progressText.handle, TEXT_JUSTIFY_CENTER, TEXT_JUSTIFY_RIGHT);

    return {
        box,
        text,
        progressText,
        buttonClaim,
        buttonClaimText,
    }
}