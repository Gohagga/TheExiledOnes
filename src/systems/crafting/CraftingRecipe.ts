import { Log } from "Log";
import { Item, Unit } from "w3ts/index";
import { CraftingResult } from "./CraftingResult";
import { AllTiers, InvertTier, Material, TierEnd, TierStart } from "./Material";

export class CraftingRecipe {



    constructor(
        private readonly materialDefs: Record<number, Material>,
        private readonly neededMaterials: Material[]
    ) {
        
    }

    private SelectCraftingMaterials(mats: number[]): number[] {

        return mats;
    }

    private GetUnitItems(unit: Unit) {
        
        try {

            Log.Info("Getting unit items")
            let items: Item[] = [];
            for (let i = 0; i < 6; i++) {
                let it = UnitItemInSlot(unit.handle, i);
                Log.Info("Found", GetItemName(it));
                if (it) items.push(Item.fromHandle(it));
            }
    
            Log.Info("Returning items", items.length);
            return items;
        } catch (ex) {
            Log.Error(ex);
            return [];
        }
    }

    private GetMaterialTier(material: Material): number {

        let tierX = math.floor((material / TierStart) % TierEnd);
        return tierX;
    }

    GetHighestTierMaterials(unit: Unit): CraftingResult | null {

        Log.Info("Getting highest materials")
        let items = this.GetUnitItems(unit);
        let toConsume: Item[] = [];
        let lowestTier: Material = AllTiers;

        for (let mat of this.neededMaterials) {

            let foundIndex = -1;
            let foundTier = -1; 
            
            for (let i = 0; i < items.length; i++) {

                let item = items[i];
                let typeId = item.typeId;
                if (typeId in this.materialDefs == false) continue;

                let itemMaterial = this.materialDefs[typeId];
                let itemTier = this.GetMaterialTier(itemMaterial);
                
                if (mat == (itemMaterial & mat) &&
                    itemTier > foundTier
                ) {
                    foundIndex = i;
                    foundTier = itemTier;
                    lowestTier &= itemTier;
                    Log.Info("Found item", item.name, "Type", item.typeId, "Material", itemMaterial, "Tier", itemTier);
                }
            }

            if (foundIndex == -1) {

                Log.Error("Cannot find material", mat, foundIndex);
                return null;
            }

            // A B C D

            // 1. pop D
            // A B C    3
            // D B C

            // 2. pop C
            // D B      2
            // C B

            // 3. pop B
            // D        1
            // B

            toConsume.push(items[foundIndex]);
            Log.Info("To consume", toConsume.length);
            let last = items.pop();
            if (foundIndex != items.length && last) {
                items[foundIndex] = last;
            }
        }
        return new CraftingResult(toConsume, lowestTier);
    }

    Consume(unit: Unit): boolean {

        return true;
    }
}