import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { BuildingAbilityBase, Wc3BuildingAbility } from "systems/abilities/BuildingAbilityBase";
import { IAbility } from "systems/abilities/IAbility";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { ErrorService } from "systems/ui/ErrorService";
import { Item, Timer, Trigger, Unit } from "w3ts/index";

export class ExperimentChamber extends BuildingAbilityBase {
    
    constructor(
        data: Wc3BuildingAbility,
        spellbookAbility: IAbility,
        abilityEvent: IAbilityEventHandler,
        slotManager: AbilitySlotManager,
        errorService: ErrorService,
        craftingManager: CraftingManager,
    ) {
        super(data, spellbookAbility, abilityEvent, slotManager, errorService,
            craftingManager.CreateRecipe(data.materials || []));
            
        abilityEvent.OnAbilityEffect(this.buildId, (e: AbilityEvent) => this.Execute(e));

        let finishBuilding = new Trigger();
        finishBuilding.registerAnyUnitEvent(EVENT_PLAYER_UNIT_CONSTRUCT_FINISH);
        finishBuilding.addAction(() => this.OnUnitBuilt());
    }

    OnUnitBuilt(): void {
        
        let unit = Unit.fromEvent();
        if (unit.typeId != this.builtUnitId) return;
        
    }

    Execute(e: AbilityEvent): boolean {
        
        return this.OnBuild(e.caster);
    }

    TooltipDescription = undefined;
}

