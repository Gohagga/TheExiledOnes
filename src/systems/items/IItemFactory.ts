import { Material } from "systems/crafting/Material";
import { Item } from "w3ts/index";
import { ItemConfig } from "./ItemConfig";

export interface IItemFactory {
    
    RegisterItem(config: ItemConfig): void;

    CreateItemByType(itemTypeId: number): Item;
}