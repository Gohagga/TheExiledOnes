import { Frame } from "w3ts/index";

export interface IQuestView {
    questSlots: IQuestSlotView[];
}

export interface IQuestSlotView {
    box: Frame;
    text: Frame;
    progressText: Frame;
    buttonClaim: Frame;
    buttonClaimText: Frame;
}