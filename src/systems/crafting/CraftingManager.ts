import { Log } from "Log";
import { Item, Timer, Unit } from "w3ts/index";
import { CraftingRecipe } from "./CraftingRecipe";
import { AllTiers, InvertTier, Material, TierEnd, TierStart } from "./Material";

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


    public CheckItem(item: Item, matGroup: [...(Material | number)[]]) {
        let typeId = item.typeId;
        let itemMaterial: Material | null = null;

        let matType = matGroup[0];
        let matType2 = matGroup[1];
        let matTypeNoTier = matType & ~AllTiers;
        let matTypeTiers = matType & AllTiers;
        let invert = InvertTier == (matType & InvertTier);
        
        if (matType == Material.Unique) itemMaterial = Material.Unique;
        if (typeId in this.itemMaterials)
            itemMaterial = this.itemMaterials[typeId];

        if (!itemMaterial) return false;
        
        let itemTier = math.floor((itemMaterial / TierStart) % TierEnd);

        // If recipe calls for a unique item, do a check
        if (matType == Material.Unique && matType2 != typeId) return false;

        // If everything except tier is same
        // And something matches the tier
        if (matType != Material.Unique &&
            (matTypeNoTier == (itemMaterial & matTypeNoTier)))
            return false;

        // The item is fine 
        return true;
    }
}