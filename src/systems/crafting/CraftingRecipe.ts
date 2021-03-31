import { Log } from "Log";
import { Item, Unit } from "w3ts/index";
import { CraftingResult } from "./CraftingResult";
import { AllTiers, InvertTier, Material, TierEnd, TierStart } from "./Material";

export class CraftingRecipe {

    public readonly costString: string;
    public readonly costStringFormatted: string;
    
    constructor(
        private readonly materialDefs: Record<number, Material>,
        private readonly neededMaterialsGrouped: [number, ...Material[]][] = [],
        private readonly neededMaterials: Material[]
    ) {
        [this.costString, this.costStringFormatted] = this.GenerateCostMessage();
    }

    private GenerateCostMessage() {

        let costString = '';
        let costStringFormatted = '';
        for (let matGroup of this.neededMaterialsGrouped) {
            
            let neededAmount = matGroup[0];
            if (neededAmount < 1) continue;
            if (matGroup.length < 2) Log.Error("Need to define at least one material type.");
            let matType = matGroup[1];

            let name = neededAmount + ' ' + this.MaterialToString(matType);
            costStringFormatted += '\n' + name;
            costString += ' ' + name;
        }
        return [costString.trim(), costStringFormatted.trim()];
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

    CraftTierInclusive(unit: Unit): CraftingResult {

        Log.Info("Getting highest materials")
        let items = this.GetUnitItems(unit);
        let toConsume: Item[] = [];
        let lowestTier: Material = AllTiers;

        let errors: string[] = [];

        for (let matGroup of this.neededMaterialsGrouped) {

            let neededAmount = matGroup[0];
            if (neededAmount < 1) continue;
            if (matGroup.length < 2) Log.Error("Need to define at least one material type.");

            let matType = matGroup[1];
            let matTypeNoTier = matType & ~AllTiers;
            let matTypeTiers = matType & AllTiers;
            let invert = InvertTier == (matType & InvertTier);
            let found = 0;

            for (let count = 0; count < neededAmount; count++) {

                let foundIndex = -1;
                let foundTier = 0;
    
                for (let i = 0; i < items.length; i++) {
    
                    let item = items[i];
                    let typeId = item.typeId;
                    if (typeId in this.materialDefs == false) continue;
    
                    let itemMaterial = this.materialDefs[typeId];
                    let itemTier = this.GetMaterialTier(itemMaterial);

                    Log.Info("Mat tier", matTypeTiers, "item tier", itemMaterial & matTypeTiers, "last", foundTier);

                    // If everything except tier is same
                    // And something matches the tier
                    if (matTypeNoTier == (itemMaterial & matTypeNoTier) &&
                        (itemMaterial & matTypeTiers) > foundTier
                    ) {
                        foundIndex = i;
                        foundTier = itemTier;
                        Log.Info("Found item", item.name, "Type", item.typeId, "Material", this.MaterialToString(itemMaterial), "Tier", itemTier);
                    }
                }

                if (foundIndex == -1) {

                } else {
                    Log.Info("123");
                    toConsume.push(items[foundIndex]);
                    let last = items.pop();
                    Log.Info("Lowest, found", lowestTier, foundTier);
                    if (foundTier < lowestTier) lowestTier = foundTier;
                    if (foundIndex != items.length && last) {
                        items[foundIndex] = last;
                    }
                    found++;
                }
            }

            if (found != neededAmount) {
                errors.push((neededAmount - found).toString() + " " + this.MaterialToString(matType));
            }
        }

        return new CraftingResult(errors.length == 0, toConsume, lowestTier, errors);
    }

    GetHighestTierMaterials(unit: Unit): CraftingResult {

        Log.Info("Getting highest materials")
        let items = this.GetUnitItems(unit);
        let toConsume: Item[] = [];
        let lowestTier: Material = AllTiers;

        let errors: string[] = [];

        for (let matGroup of this.neededMaterialsGrouped) {

            let neededAmount = matGroup[0];
            if (neededAmount < 1) continue;
            if (matGroup.length < 2) Log.Error("Need to define at least one material type.");

            let matType = matGroup[1];
            let found = 0;

            for (let count = 0; count < neededAmount; count++) {

                let foundIndex = -1;
                let foundTier = -1;
    
                for (let i = 0; i < items.length; i++) {
    
                    let item = items[i];
                    let typeId = item.typeId;
                    if (typeId in this.materialDefs == false) continue;
    
                    let itemMaterial = this.materialDefs[typeId];
                    let itemTier = this.GetMaterialTier(itemMaterial);

                    if (matType == (itemMaterial & matType) &&
                        itemTier > foundTier
                    ) {
                        foundIndex = i;
                        foundTier = itemTier;
                        Log.Info("Found item", item.name, "Type", item.typeId, "Material", this.MaterialToString(itemMaterial), "Tier", itemTier);
                    }
                }

                if (foundIndex == -1) {

                } else {
                    toConsume.push(items[foundIndex]);
                    let last = items.pop();
                    lowestTier &= foundTier;
                    if (foundIndex != items.length && last) {
                        items[foundIndex] = last;
                    }
                    found++;
                }
            }

            if (found != neededAmount) {
                errors.push((neededAmount - found).toString() + " " + this.MaterialToString(matType));
            }
        }

        return new CraftingResult(errors.length == 0, toConsume, lowestTier, errors);
    }

    Consume(unit: Unit): boolean {

        return true;
    }
}