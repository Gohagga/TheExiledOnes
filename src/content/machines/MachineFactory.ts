import { Config } from "config/Config";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { ItemTransferNodeManager } from "systems/crafting/ItemTransferNodeManager";
import { IMachine } from "systems/crafting/machine/IMachine";
import { IItemFactory } from "systems/items/IItemFactory";
import { ErrorService } from "systems/ui/ErrorService";
import { Unit } from "w3ts/index";
import { ObliterumMachine } from "./ObliterumMachine";
import { TransmuterMachine } from "./TransmuterMachine";
import { WorkstationMachine } from "./WorkstationMachine";

export class MachineFactory {

    constructor(
        private config: Config,
        private craftingManager: CraftingManager,
        private itemFactory: IItemFactory,
        private errorService: ErrorService,
        private itemTransferNodeManager: ItemTransferNodeManager
    ) {
        
    }

    CreateWorkstation(unit: Unit) {

        let workstation = new WorkstationMachine(
            this.config.WorkstationMachine, unit, this.errorService,
            this.craftingManager, this.itemFactory);
        
        return workstation;
    }

    CreateTransmuter(unit: Unit) {

        let workstation = new TransmuterMachine(
            this.config.TransmuterMachine, unit, this.errorService,
            this.craftingManager, this.itemFactory);
        
        return workstation;
    }

    CreateObliterum(unit: Unit) {

        let workstation = new ObliterumMachine(
            this.config.ObliterumMachine, unit, this.errorService,
            this.craftingManager, this.itemFactory);
        
        return workstation;
    }

    CreateItemTransferNode(unit: Unit) {

        this.itemTransferNodeManager.Register(unit);
    }
}