import { Log } from "Log";
import { Item, Unit } from "w3ts/index";
import { CraftingResult } from "./CraftingResult";
import { AllTiers, InvertTier, Material, TierEnd, TierStart } from "./Material";
import { MaterialToColoredString, MaterialToString } from "./MaterialToString";

export class CraftingRecipe {

    public readonly costString: string;
    public readonly costStringFormatted: string;
    
    constructor(
        private readonly materialDefs: Record<number, Material>,
        private readonly neededMaterialsGrouped: [number, ...Material[]][] = [],
        private readonly neededMaterials: Material[],
        private readonly neededFel: number = 0
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
            let matType2 = matGroup[2];

            let nameFormatted = MaterialToColoredString(matType, matGroup[2]);
            let name = MaterialToString(matType, matGroup[2]);

            if (neededAmount > 1) {
                nameFormatted = neededAmount + ' ' + nameFormatted;
                name = neededAmount + ' ' + name;
            }

            costStringFormatted += '\n' + nameFormatted;
            costString += ' ' + name;
        }
        if (this.neededFel > 0) {
            costStringFormatted += '\n|cff76f545' + this.neededFel + ' Fel|r';
            costString += ' |cff76f545' + this.neededFel + ' Fel|r';
        }
        return [costString.trim(), costStringFormatted.trim()];
    }

    private GetUnitItems(unit: Unit) {
        
        try {

            Log.Debug("Getting unit items")
            let items: Item[] = [];
            for (let i = 0; i < 6; i++) {
                let it = UnitItemInSlot(unit.handle, i);
                Log.Debug("Found", GetItemName(it));
                if (it) items.push(Item.fromHandle(it));
            }
    
            Log.Debug("Returning items", items.length);
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

    CraftTierInclusive(unit: Unit, items?: Item[]): CraftingResult {

        Log.Debug("Getting highest materials")
        items = items || this.GetUnitItems(unit);
        let toConsume: Item[] = [];
        let lowestTier: Material = AllTiers;

        let errors: string[] = [];

        for (let matGroup of this.neededMaterialsGrouped) {

            Log.Info("Mat Group", matGroup.length, matGroup[0], matGroup[1]);

            let neededAmount = matGroup[0];
            if (neededAmount < 1) continue;
            if (matGroup.length < 2) Log.Error("Need to define at least one material type.");

            let matType = matGroup[1];
            let matType2 = matGroup[2];
            let matTypeNoTier = matType & ~AllTiers;
            let matTypeTiers = matType & AllTiers;
            let invert = InvertTier == (matType & InvertTier);
            let found = 0;

            for (let count = 0; count < neededAmount; count++) {

                let foundIndex = -1;
                let foundTier = -1;
    
                for (let i = 0; i < items.length; i++) {
    
                    let item = items[i];
                    let typeId = item.typeId;
                    let itemMaterial: Material | null = null;

                    if (matType == Material.Unique) itemMaterial = Material.Unique;
                    if (typeId in this.materialDefs)
                        itemMaterial = this.materialDefs[typeId];

                    if (!itemMaterial) continue;
                    
                    let itemTier = this.GetMaterialTier(itemMaterial);

                    Log.Debug("Mat tier", matTypeTiers, "item tier", itemMaterial && itemMaterial & matTypeTiers, "last", foundTier);

                    // If recipe calls for a unique item, do a check
                    if (matType == Material.Unique && matType2 != typeId) continue;

                    // If everything except tier is same
                    // And something matches the tier
                    if (matType != Material.Unique &&
                        (matTypeNoTier == (itemMaterial & matTypeNoTier) &&
                        (itemMaterial & matTypeTiers) > foundTier) == false)
                        continue;

                    // The item is fine

                    foundIndex = i;
                    foundTier = itemTier;
                    Log.Debug("Found item", item.name, "Type", item.typeId, "Material", itemMaterial && MaterialToString(itemMaterial, matType2), "Tier", itemTier);
                }

                if (foundIndex == -1) {

                } else {
                    toConsume.push(items[foundIndex]);
                    let last = items.pop();
                    Log.Debug("Lowest, found", lowestTier, foundTier);
                    if (foundTier < lowestTier) lowestTier = foundTier;
                    if (foundIndex != items.length && last) {
                        items[foundIndex] = last;
                    }
                    found++;
                }
            }

            if (found != neededAmount) {
                let msg = MaterialToString(matType, matType2);
                if (neededAmount - found > 1) msg = neededAmount - found + ' ' + msg;

                errors.push(msg);
            }
        }


        if (this.neededFel > 0) {
            let felDiff = this.neededFel - unit.mana;
            if (felDiff > 0) errors.push(felDiff + ' Fel');
        }

        Log.Info("returning crafting result", errors.length == 0, toConsume.length);
        return new CraftingResult(errors.length == 0, toConsume, this.neededFel, lowestTier, unit, errors);
    }

    GetHighestTierMaterials(unit: Unit): CraftingResult {

        Log.Debug("Getting highest materials")
        let items = this.GetUnitItems(unit);
        let toConsume: Item[] = [];
        let lowestTier: Material = AllTiers;

        let errors: string[] = [];

        for (let matGroup of this.neededMaterialsGrouped) {

            let neededAmount = matGroup[0];
            if (neededAmount < 1) continue;
            if (matGroup.length < 2) Log.Error("Need to define at least one material type.");

            let matType = matGroup[1];
            let matType2 = matGroup[2];
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
                        Log.Debug("Found item", item.name, "Type", item.typeId, "Material", MaterialToString(itemMaterial), "Tier", itemTier);
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
                let msg = MaterialToString(matType, matType2);
                if (neededAmount - found > 1) msg = neededAmount - found + ' ' + msg;

                errors.push(msg);
            }
        }
        
        if (this.neededFel > 0) {
            let felDiff = this.neededFel - unit.mana;
            if (felDiff > 0) errors.push(felDiff + ' Fel');
        }

        return new CraftingResult(errors.length == 0, toConsume, this.neededFel, lowestTier, unit, errors);
    }
}