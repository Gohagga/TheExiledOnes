import { Log } from "Log";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { MachineBase } from "systems/crafting/machine/Machine";
import { MachineConfig, RecipeMachineConfig } from "systems/crafting/machine/MachineConfig";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { IItemFactory } from "systems/items/IItemFactory";
import { ErrorService } from "systems/ui/ErrorService";
import { Item, Point, Unit } from "w3ts/index";

export class ObliterumMachine extends MachineBase {

    constructor(
        config: RecipeMachineConfig,
        unit: Unit,
        errorService: ErrorService,
        craftingManager: CraftingManager,
        itemFactory: IItemFactory,
    ) {
        config.workEffectPosition = { x: 0, y: 0, z: 250 };
        super(config, unit, errorService, itemFactory);

        for (let r of config.recipes) {

            let recipe = craftingManager.CreateRecipe(r.materials, r.neededFel);
            let trainId = typeof r.trainId === "string" ? FourCC(r.trainId) : r.trainId;

            if (r.resultId) {
                let resultId = typeof r.resultId === "string" ? FourCC(r.resultId) : r.resultId;
                this.RegisterMachineRecipe(trainId, (machine, recipeId, result) => {
                    try {
                        result.destroy();
                        // machine.unit.addItem(item);
            
                        let rallyUnit = GetUnitRallyUnit(this.unit.handle);
                        if (rallyUnit && rallyUnit != this.unit.handle && IsUnitInRangeLoc(this.unit.handle, GetUnitLoc(rallyUnit), 220)) {
                            
                            let item = this.itemFactory.CreateItemByType(resultId, GetUnitX(rallyUnit), GetUnitY(rallyUnit));
                            UnitAddItem(rallyUnit, item.handle);
                            return;
                        }
                        
                        let rallyPoint = GetUnitRallyPoint(this.unit.handle);
                        if (rallyPoint && IsUnitInRangeLoc(this.unit.handle, rallyPoint, 150)) {
                            let item = this.itemFactory.CreateItemByType(resultId, GetLocationX(rallyPoint), GetLocationY(rallyPoint));
                            SetItemPositionLoc(item.handle, rallyPoint);
                            return;
                        }

                        let item = this.itemFactory.CreateItemByType(resultId, machine.unit.x, machine.unit.y);
                    } catch(ex) {
                        Log.Error(ex);
                    }
                }, recipe);
            } else {
                this.RegisterMachineRecipe(trainId, () => null, recipe);
            }
        }
    }
}