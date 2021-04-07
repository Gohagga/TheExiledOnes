import { EventBusHandler } from "../generic/EventBusHandler";
import { RecordEventHandler } from "../generic/RecordEventHandler";
import { DimensionEnterEvent } from "./DimensionEvent";
import { DimensionType } from "./DimensionType";
import { IDimensionEventHandler } from "./IDimensionEventHandler";

export class DimensionEventHandler implements IDimensionEventHandler {

    private readonly handles: Record<DimensionType, EventBusHandler<(e: any) => void>> = {
        [DimensionType.Surface]: new EventBusHandler<(e: DimensionEnterEvent) => void>(),
        [DimensionType.Underground]: new EventBusHandler<(e: DimensionEnterEvent) => void>(),
    }

    public Unsubscribe(type: DimensionType, id: number) {
        this.handles[type].Unsubscribe(id);
    }

    public Subscribe(type: DimensionType, callback: (e: DimensionEnterEvent) => void) {
        return this.handles[type].Subscribe(callback);
    }

    public OnSurfaceEvent(callback: (e: DimensionEnterEvent) => void) {
        return this.Subscribe(DimensionType.Surface, callback);
    }

    public OnUndergroundEvent(callback: (e: DimensionEnterEvent) => void) {
        return this.Subscribe(DimensionType.Underground, callback);
    }

    public Raise(type: DimensionType, eventModel: DimensionEnterEvent) {
        let event: any;

        let subs = this.handles[type].Subscriptions.values();
        for (let sub of subs) {
            sub(eventModel);
        }
    }
}