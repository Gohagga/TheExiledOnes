import { Log } from "Log";
import { IEnumUnitService } from "services/enum-service/IEnumUnitService";
import { Item, Point, Timer, Unit } from "w3ts";

export type FlyingItem = {
    item: Item,
    x: number,
    y: number,
    angle: number,
    targetUnit: Unit,
    alive: boolean,
}

const fps = 0.03

export class FlyingItemsManager {

    private instances: FlyingItem[] = [];
    private index: Record<number, FlyingItem> = {};
    private speed = 600;

    private readonly instancesToAdd: FlyingItem[] = [];

    constructor(
        private readonly enumService: IEnumUnitService
    ) {
        new Timer().start(fps, true, () => this.Update2());
    }

    Register(sourceUnit: Unit, item: Item, targetUnit: Unit) {

        let itemId = item.id;
        // if (itemId in this.index) {
        //     this.index[itemId].alive = false;
        // }

        // print("making new", this.instances.length);

        let fi: FlyingItem = {
            item,
            targetUnit,
            x: targetUnit.x,
            y: targetUnit.y,
            angle: math.atan(targetUnit.y - sourceUnit.y, targetUnit.x - sourceUnit.x),
            alive: true
        };

        // if (itemId in this.index) print("alive first", this.index[itemId].alive, "alive second", fi.alive);
        // this.index[itemId] = fi;
        // print("alive", this.index[itemId].alive);
        
        item.setPosition(sourceUnit.x + math.cos(fi.angle) * 100, sourceUnit.y + math.sin(fi.angle) * 100);

        this.instancesToAdd.push(fi);
        // print("making new end", this.instances.length, fi);
    }

    Update() {

        let count = this.instances.length;
        for (let i = 0; i < count; i++) {

            let fi = this.instances[i];

            if (fi.alive) {

                // Logic
                let x = fi.item.x + this.speed * math.cos(fi.angle) * fps;
                let y = fi.item.y + this.speed * math.sin(fi.angle)  * fps;
                
                // Check if item has bumped something
                fi.item.setPosition(x, y);
                if (IsUnitInRangeXY(fi.targetUnit.handle, x, y, 50)) {
                    //math.abs(x - fi.x) < 100 && math.abs(y - fi.y) < 100) {
                    // Item has arrived
                    fi.alive = false;
                    fi.targetUnit.addItem(fi.item);
                } else if (math.abs(fi.item.x - x) > 0.5 || math.abs(fi.item.y - y) > 0.5) {
                    // Bump has happened.
                    fi.alive &&= false;
                } else {
    
                    let ix = fi.item.x;
                    let iy = fi.item.y;
                    if ((x-ix)*(x-ix) + (y-iy)*(y-iy) >= 1000000) {

                        fi.alive &&= false;
                    } else {
                        fi.item.setPosition(x, y);
                    }
                }
            }

            if (this.instances[i].alive == false) {
                let last = this.instances.pop();
                if (i < count - 1 && last)
                    this.instances[i] = last;
            }
            // if (this.index[fi.item.id].alive == false)
            //     delete this.index[fi.item.id];
        }
    }

    Update2() {

        let count = this.instances.length;
        // print("Update", count);
        for (let i = 0; i < this.instances.length; i++) {

            let fi = this.instances[i];

            // print("i", i, "len", this.instances.length);
            // Logic
            let x = fi.item.x + this.speed * math.cos(fi.angle) * fps;
            let y = fi.item.y + this.speed * math.sin(fi.angle)  * fps;
                
            // Check if item has bumped something
            fi.item.setPosition(x, y);
            if (IsUnitInRangeXY(fi.targetUnit.handle, x, y, 50)) {

                // Item has arrived
                // print("Item has arrived");
                fi.alive = false;
                fi.targetUnit.addItem(fi.item);

            } else if (math.abs(fi.item.x - x) > 0.5 || math.abs(fi.item.y - y) > 0.5) {
                    
                // Bump has happened.
                fi.alive = false;
                // print("Bump has happened", fi.item.x - x, fi.item.y - y);

            } else {
    
                let ix = fi.item.x;
                let iy = fi.item.y;
                if ((fi.x-ix)*(fi.x-ix) + (fi.y-iy)*(fi.y-iy) >= 1000000) {

                    fi.alive = false;
                    // print("Max range reached");
                }
            }
            // print("is alive", fi.alive, fi.item.id);

            if (fi.alive == false) {
                let last = this.instances.pop();
                if (i < this.instances.length && last)
                    this.instances[i] = last;
                
                // if (this.index[fi.item.id].alive == false)
                //     delete this.index[fi.item.id];
            }
        }

        let item: FlyingItem | undefined;
        while (item = this.instancesToAdd.pop()) {
            // print("adding new to list", item);
            this.instances.push(item);
        }
    }
}