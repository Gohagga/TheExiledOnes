import { Log } from "Log";
import { BuildingAbilityBase, Wc3BuildingAbility } from "systems/abilities/BuildingAbilityBase";
import { IAbility } from "systems/abilities/IAbility";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { Material } from "systems/crafting/Material";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { ErrorService } from "systems/ui/ErrorService";

export class Workstation extends BuildingAbilityBase {

    constructor(
        data: Wc3BuildingAbility,
        spellbookAbility: IAbility,
        abilityEvent: IAbilityEventHandler,
        slotManager: AbilitySlotManager,
        craftingManager: CraftingManager,
        errorService: ErrorService,
    ) {
        super(data, spellbookAbility, abilityEvent, slotManager, errorService,
            craftingManager.CreateRecipe([
                [3, Material.Stone],
                [3, Material.Wood]
            ]));

        abilityEvent.OnAbilityEffect(this.buildId, (e: AbilityEvent) => this.Execute(e));
    }

    Execute(e: AbilityEvent): void {
        
        let caster = e.caster;
        Log.Info(caster.name, "has cast", this.name);

        this.OnBuild(caster);
    }
}