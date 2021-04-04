import { Log } from "Log";
import { Timer, Unit } from "w3ts/index";
import { CraftingRecipe } from "./CraftingRecipe";
import { Material } from "./Material";

export class CraftingManager {

    private readonly itemMaterials: Record<number, Material> = {};
    // private readonly recipes: Record<number, CraftingRecipe> = {};
    
    constructor(
    ) {
    }

    public CreateRecipe(materials: [number, ...Material[]][], fel?: number): CraftingRecipe {

        if (fel) return new CraftingRecipe(this.itemMaterials, materials, [], fel);
        return new CraftingRecipe(this.itemMaterials, materials, []);
    }

    public RegisterItemMaterial(itemTypeId: number, material: Material) {

        Log.Info("Registered", itemTypeId, material);
        this.itemMaterials[itemTypeId] = material;
    }
}