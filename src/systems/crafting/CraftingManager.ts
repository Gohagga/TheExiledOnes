import { Log } from "Log";
import { CraftingRecipe } from "./CraftingRecipe";
import { Material } from "./Material";

export class CraftingManager {

    private readonly itemMaterials: Record<number, Material> = {};
    private readonly recipes: Record<number, CraftingRecipe> = {};
    
    constructor(
    ) {
        
    }

    CreateRecipe(materials: [number, ...Material[]][]): CraftingRecipe {

        return new CraftingRecipe(this.itemMaterials, materials, []);
    }

    private MaterialToString(material: Material) {

        let name = '';
        if (Material.Wood == (Material.Wood & material)) name += ' Wood'
        if (Material.Stone == (Material.Stone & material)) name += ' Stone'
        if (Material.Metal == (Material.Metal & material)) name += ' Metal'
        if (Material.FineMetal == (Material.FineMetal & material)) name += ' Fine Metal'
        
        if (Material.TierI == (Material.TierI & material)) name += ' I'
        if (Material.TierII == (Material.TierII & material)) name += ' II'
        if (Material.TierIII == (Material.TierIII & material)) name += ' III'
        if (Material.TierIV == (Material.TierIV & material)) name += ' IV'

        return name.trim();
    }

    RegisterItemMaterial(itemTypeId: number, material: Material) {

        Log.Info("Registered", itemTypeId, material);
        this.itemMaterials[itemTypeId] = material;
    }
}