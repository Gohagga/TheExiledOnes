import { DimensionEnterEvent } from "./DimensionEvent";
import { DimensionType } from "./DimensionType";

export interface IDimensionEventHandler {

    Unsubscribe(type: DimensionType, id: number): void;

    Subscribe(type: DimensionType, callback: (e: DimensionEnterEvent) => void): number;

    OnSurfaceEvent(callback: (e: DimensionEnterEvent) => void): number;

    OnUndergroundEvent(callback: (e: DimensionEnterEvent) => void): number;

    Raise(type: DimensionType, eventModel: DimensionEnterEvent): void;
}