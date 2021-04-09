import { ResourceItem } from "content/items/ResourceItem";
import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { InputHandler, MetaKey } from "systems/events/input-events/InputHandler";
import { IItemFactory } from "systems/items/IItemFactory";
import { ToolManager } from "systems/tools/ToolManager";
import { MapPlayer, Trigger, Unit } from "w3ts/index";
import { ToolAbilityBase } from "../../../systems/abilities/ToolAbilityBase";
export class Hand extends ToolAbilityBase {

    constructor(
        data: Wc3Ability,
        abilityEvent: IAbilityEventHandler,
        private readonly inputHandler: InputHandler,
        private readonly toolManager: ToolManager,
        private readonly itemFactory: IItemFactory,
    ) {
        super(data);
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));
        BlzSetAbilityTooltip(this.id, data.name, 0);

        let t = new Trigger();
        inputHandler.RegisterAllPlayerKeyEvent(t, OSKEY_U, MetaKey.None, false);
        t.addAction(() => {

            let player = MapPlayer.fromEvent();

            let units = this.inputHandler.GetPlayerSelectedUnitIds(player);
            if (units.length > 1) return;

            let selected = units.pop();
            if (!selected) return;

            toolManager.Unequip(selected);
        });
    }

    Execute(e: AbilityEvent): void {
        
        let caster = e.caster;
        let level = e.abilityLevel;
        let target = e.targetDestructable;

        if (!target) return;

        let dmg = 2
        caster.damageTarget(target.handle, dmg, true, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_NORMAL, WEAPON_TYPE_AXE_MEDIUM_CHOP);

        let item = this.itemFactory.CreateItemByType(ResourceItem.Branch);
        if (caster.addItem(item) == false)
            item.setPosition(target.x, target.y);

        // let rand = math.random();
        // // If widget has died, do drops
        // if (rand <= 0.60) {
            
        //     // Log.Info("Dropping");
        // }
    }
    
    TooltipDescription = (unit: Unit) => 
`Interacts with an object.

Tree - obtain a Branch (wood material).`;
}