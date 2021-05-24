import { ISlottable } from "./ISlottable";

export interface ISlotManager<Owner, SlotType> {

    ApplySlot(owner: Owner, slot: SlotType, item: ISlottable<Owner>): void;

    GetSlot(owner: Owner, slot: SlotType): ISlottable<Owner> | null;

    ClearSlot(owner: Owner, slot: SlotType): boolean;
}