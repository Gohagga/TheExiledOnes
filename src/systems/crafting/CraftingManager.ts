import { Log } from "Log";
import { CraftingRecipe } from "./CraftingRecipe";
import { Material } from "./Material";

export class CraftingManager {

    private readonly itemMaterials: Record<number, Material> = {};
    private readonly recipes: Record<number, CraftingRecipe> = {};
    
    constructor(
    ) {
        
    }

    CreateRecipe(materials: Material[]): CraftingRecipe {

        return new CraftingRecipe(this.itemMaterials, materials);
    }

    RegisterItemMaterial(itemTypeId: number, material: Material) {

        Log.Info("Registered", itemTypeId, material);
        this.itemMaterials[itemTypeId] = material;
    }
}