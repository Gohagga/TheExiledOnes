import { Log } from "Log";
import { Item, Unit } from "w3ts/index";
import { Material } from "./Material";

export class CraftingResult {

    constructor(
        public readonly successful: boolean,
        public readonly itemsToConsume: Item[],
        public readonly felToConsume: number,
        public readonly lowestTier: Material,
        public readonly unit: Unit,
        public readonly errors: string[],
    ) {
        
    }

    Consume() {
        for (let item of this.itemsToConsume) {
            item.destroy();
        }
        this.unit.mana -= this.felToConsume;
    }

    DisplayErrors() {
        for (let e of this.errors) {
            Log.Error('Missing ' + e);
        }
        return;
    }
}