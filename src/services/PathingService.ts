import { Log } from "Log";
import { Item } from "w3ts/index";

export class PathingService {

    private static _instance: PathingService;

    public static get instance(): PathingService {
        if (!this._instance)
            Log.Error(PathingService, "No initialized instance.");

        return this._instance;
    }

    private item: Item;
    private itemId: number;

    constructor(dummyItemCode: string) {
        this.itemId = FourCC(dummyItemCode);
        this.item = new Item(this.itemId, 0, 0);
        this.item.visible = false;

        PathingService._instance = this;
    }

    GetNearestPoint(x: number, y: number): { x: number, y: number } {
        // let item = new Item(this.itemId, 0, 0);
        this.item.setPosition(x, y);
        
        let point = {
            x: this.item.x,
            y: this.item.y
        }
        return point;
    }

    IsPathable(x: number, y: number) {
        this.item.setPosition(x, y);
        if (math.abs(this.item.x - x) > 0.5 || math.abs(this.item.y - y) > 0.5) {
            return false;
        }
        return true;
    }

    IsPathableX(x: number, y: number) {
        this.item.setPosition(x, y);
        if (math.abs(this.item.x - x) > 0.5) {
            return false;
        }
        return true;
    }

    IsPathableY(x: number, y: number) {
        this.item.setPosition(x, y);
        if (math.abs(this.item.y - y) > 0.5) {
            return false;
        }
        return true;
    }
}