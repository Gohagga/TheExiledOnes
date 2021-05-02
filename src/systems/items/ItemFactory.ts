import { Log } from "Log";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { Material } from "systems/crafting/Material";
import { MaterialToColoredString, MaterialToString } from "systems/crafting/MaterialToString";
import { Color, Item } from "w3ts/index";
import { IItemFactory } from "./IItemFactory";
import { ItemConfig } from "./ItemConfig";

export class ItemFactory implements IItemFactory {
    
    private definitions: Record<number, ItemConfig> = {};

    private materialStringColor = new Color(204, 204, 204).code;

    constructor(
        configs: ItemConfig[],
        private readonly craftingManager: CraftingManager,
    ) {
        for (let c of configs) {
            this.RegisterItem(c);
        }
    }

    RegisterItem(config: ItemConfig): void {
        
        this.definitions[config.itemTypeId] = config;

        if (config.material)
            this.craftingManager.RegisterItemMaterial(config.itemTypeId, config.material);
    }

    RegisterResource(itemTypeId: number, material: Material): void {
        
        this.definitions[itemTypeId] = {
            itemTypeId: itemTypeId,
            material: material
        }

        this.craftingManager.RegisterItemMaterial(itemTypeId, material);
    }
    
    CreateItemByType(itemTypeId: number, x: number = 0, y: number = 0): Item {
        
        if (itemTypeId in this.definitions == false)
            throw Log.Error("Item not configured in ItemFactory", GetObjectName(itemTypeId));

        let def = this.definitions[itemTypeId];

        // Create the item first
        let item = new Item(itemTypeId, x, y);
        
        if (def.name) item.tooltip = def.name;

        let tooltip = item.extendedTooltip;
        if (def.tooltip) tooltip = def.tooltip;
        
        if (def.material)
            tooltip += '\n\nMaterial ' + MaterialToColoredString(def.material);
        
        item.extendedTooltip = tooltip;

        return item;
    }
}