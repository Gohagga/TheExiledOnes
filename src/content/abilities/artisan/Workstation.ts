import { MachineFactory } from "content/machines/MachineFactory";
import { WorkstationMachine } from "content/machines/WorkstationMachine";
import { Log } from "Log";
import { BuildingAbilityBase, Wc3BuildingAbility } from "systems/abilities/BuildingAbilityBase";
import { IAbility } from "systems/abilities/IAbility";
import { AbilitySlot } from "systems/ability-slots/AbilitySlot";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { MachineManager } from "systems/crafting/machine/MachineManager";
import { Material } from "systems/crafting/Material";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { ErrorService } from "systems/ui/ErrorService";
import { Trigger, Unit } from "w3ts/index";

export class Workstation extends BuildingAbilityBase {

    constructor(
        data: Wc3BuildingAbility,
        spellbookAbility: IAbility,
        abilityEvent: IAbilityEventHandler,
        slotManager: AbilitySlotManager,
        craftingManager: CraftingManager,
        errorService: ErrorService,
        private machineFactory: MachineFactory,
        private machineManager: MachineManager,
    ) {
        super(data, spellbookAbility, abilityEvent, slotManager, errorService,
            craftingManager.CreateRecipe([
                [3, Material.Stone],
                [3, Material.Wood]
            ]));

        abilityEvent.OnAbilityEffect(this.buildId, (e: AbilityEvent) => this.Execute(e));

        let enterTrig = new Trigger();
        enterTrig.registerAnyUnitEvent(EVENT_PLAYER_UNIT_CONSTRUCT_FINISH);
        enterTrig.addAction(() => this.OnUnitBuilt());
    }

    OnUnitBuilt(): void {
        let unit = Unit.fromEvent();
        Log.Info("Unit finished construction", unit.name);
        if (unit.typeId == this.builtUnitId) {
            Log.Info("Unit has entered this shit");
            let workstation = this.machineFactory.CreateWorkstation(unit);
            this.machineManager.Register(workstation);
        }
    }

    Execute(e: AbilityEvent): void {
        
        let caster = e.caster;
        Log.Info(caster.name, "has cast", this.name);

        this.OnBuild(caster);
    }
}