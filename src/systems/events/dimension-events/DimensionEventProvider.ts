import { Rectangle, Region, Trigger, Unit } from "w3ts/index";
import { DimensionType } from "./DimensionType";
import { IDimensionEventHandler } from "./IDimensionEventHandler";

export class DimensionEventProvider {

    constructor(
        private dimensionEvent: IDimensionEventHandler,
        private surfaceRect: Rectangle,
        private undergroundRect: Rectangle,
    ) {

        let onSurfaceEnter = new Trigger();
        let surfaceRegion = new Region();
        surfaceRegion.addRect(surfaceRect);
        onSurfaceEnter.registerEnterRegion(surfaceRegion.handle, null);
        onSurfaceEnter.addAction(() => this.dimensionEvent.Raise(DimensionType.Surface, {
            unit: Unit.fromEvent()
        }));

        let onUndergroundEnter = new Trigger();
        let undergroundRegion = new Region();
        undergroundRegion.addRect(undergroundRect);
        onUndergroundEnter.registerEnterRegion(undergroundRegion.handle, null);
        onUndergroundEnter.addAction(() => this.dimensionEvent.Raise(DimensionType.Underground, {
            unit: Unit.fromEvent()
        }));
    }
}