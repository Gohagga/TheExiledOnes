import { Log } from "Log";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { MachineBase } from "systems/crafting/machine/Machine";
import { MachineConfig, RecipeMachineConfig } from "systems/crafting/machine/MachineConfig";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { IItemFactory } from "systems/items/IItemFactory";
import { ErrorService } from "systems/ui/ErrorService";
import { Item, Unit } from "w3ts/index";

export class WorkstationMachine extends MachineBase {

    constructor(
        config: RecipeMachineConfig,
        unit: Unit,
        errorService: ErrorService,
        craftingManager: CraftingManager,
        itemFactory: IItemFactory,
    ) {
        config.workEffectPosition = { x: 0, y: 0, z: 250 };
        super(config, unit, errorService, itemFactory);

        // this.unit.addAbility(FourCC('Asid'));

        let index = 0;
        for (let r of config.recipes) {

            let recipe = craftingManager.CreateRecipe(r.materials);
            let trainId = typeof r.trainId === "string" ? FourCC(r.trainId) : r.trainId;
            let resultId = typeof r.resultId === "string" ? FourCC(r.resultId) : r.resultId;

            this.RegisterSimpleItemMachineRecipe(trainId, resultId, recipe);
            
            // this.unit.addItemToStock(resultId, 1, 1);

            // this.RegisterOrder(resultId, trainId);
        }
    }
}