import { Config } from "Config";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { IMachine } from "systems/crafting/machine/IMachine";
import { IItemFactory } from "systems/items/IItemFactory";
import { ErrorService } from "systems/ui/ErrorService";
import { Unit } from "w3ts/index";
import { WorkstationMachine } from "./WorkstationMachine";

export class MachineFactory {

    constructor(
        private config: Config,
        private craftingManager: CraftingManager,
        private itemFactory: IItemFactory,
        private errorService: ErrorService,
    ) {
        
    }

    CreateWorkstation(unit: Unit) {

        let workstation = new WorkstationMachine(
            this.config.WorkstationMachine, unit, this.errorService,
            this.craftingManager, this.itemFactory);
        
        return workstation;
    }
}