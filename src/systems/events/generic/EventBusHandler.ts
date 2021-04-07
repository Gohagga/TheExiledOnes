
export class EventBusHandler<EventCallback> {

    private _count = 0;
    public readonly Subscriptions: Map<number, EventCallback> = new Map<number, EventCallback>();

    public Subscribe(callback: EventCallback): number {
        
        let id = this._count;
        this.Subscriptions.set(id, callback);
        this._count++;
        return id;
    }

    public Unsubscribe(id: number) {
        this.Subscriptions.delete(id);
    }

    public get count() {
        return this._count;
    }
}

export type GenericEventCallback = () => void;