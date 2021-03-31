import { Log } from "Log";
import { Item } from "w3ts/index";
import { Material } from "./Material";

export class CraftingResult {

    constructor(
        public readonly successful: boolean,
        public readonly itemsToConsume: Item[],
        public readonly lowestTier: Material,
        public readonly errors: string[],
    ) {
        
    }

    Consume() {
        for (let item of this.itemsToConsume) {
            item.destroy();
        }
    }

    DisplayErrors() {
        for (let e of this.errors) {
            Log.Error('Missing ' + e);
        }
        return;
    }
}