import { Item } from "w3ts/index";
import { Material } from "./Material";

export class CraftingResult {

    constructor(
        public readonly itemsToConsume: Item[],
        public readonly lowestTier: Material,
    ) {
        
    }
}