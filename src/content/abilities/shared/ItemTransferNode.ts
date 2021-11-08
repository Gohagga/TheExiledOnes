import { MachineFactory } from "content/machines/MachineFactory";
import { Log } from "Log";
import { BuildingAbilityBase, Wc3BuildingAbility } from "systems/abilities/BuildingAbilityBase";
import { IAbility } from "systems/abilities/IAbility";
import { AbilitySlot } from "systems/ability-slots/AbilitySlot";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { ItemTransferNodeManager } from "systems/crafting/ItemTransferNodeManager";
import { MachineManager } from "systems/crafting/machine/MachineManager";
import { Material } from "systems/crafting/Material";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { ErrorService } from "systems/ui/ErrorService";
import { Trigger, Unit } from "w3ts/index";

export class ItemTransferNode extends BuildingAbilityBase {

    constructor(
        data: Wc3BuildingAbility,
        spellbookAbility: IAbility,
        abilityEvent: IAbilityEventHandler,
        slotManager: AbilitySlotManager,
        craftingManager: CraftingManager,
        errorService: ErrorService,
        private readonly machineFactory: MachineFactory,
    ) {
        super(data, spellbookAbility, abilityEvent, slotManager, errorService,
            craftingManager.CreateRecipe(data.materials));

        abilityEvent.OnAbilityEffect(this.buildId, (e: AbilityEvent) => this.Execute(e));

        let enterTrig = new Trigger();
        enterTrig.registerAnyUnitEvent(EVENT_PLAYER_UNIT_CONSTRUCT_FINISH);
        enterTrig.addAction(() => this.OnUnitBuilt());
    }

    OnUnitBuilt(): void {
        let unit = Unit.fromEvent();
        if (unit.typeId == this.builtUnitId) {
            Log.Info("Item Transfer Node finished construction", unit.name);
            let itemTransferNode = this.machineFactory.CreateItemTransferNode(unit);
        }
    }

    Execute(e: AbilityEvent): boolean {
        
        let caster = e.caster;
        Log.Info(caster.name, "has cast", this.name);

        return this.OnBuild(caster);
    }
}