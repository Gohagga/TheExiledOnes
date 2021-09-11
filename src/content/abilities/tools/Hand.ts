import { HeroManager } from "content/gameplay/HeroManager";
import { ResourceItem } from "content/items/ResourceItem";
import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { InputHandler, MetaKey } from "systems/events/input-events/InputHandler";
import { IItemFactory } from "systems/items/IItemFactory";
import { ToolManager } from "systems/tools/ToolManager";
import { ErrorService } from "systems/ui/ErrorService";
import { MapPlayer, Trigger, Unit } from "w3ts/index";
import { ToolAbilityBase } from "../../../systems/abilities/ToolAbilityBase";

enum DestructableTypes {
    SummerTree      = FourCC('LTlt'),
    Log             = FourCC('B00L'),
}

export class Hand extends ToolAbilityBase {

    constructor(
        data: Wc3Ability,
        abilityEvent: IAbilityEventHandler,
        private readonly inputHandler: InputHandler,
        private readonly toolManager: ToolManager,
        private readonly itemFactory: IItemFactory,
        private readonly heroManager: HeroManager,
        private readonly errorService: ErrorService,
    ) {
        super(data);
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));
        BlzSetAbilityTooltip(this.id, data.name, 0);

        let t = new Trigger();
        inputHandler.RegisterAllPlayerKeyEvent(t, OSKEY_U, MetaKey.None, false);
        t.addAction(() => {

            let player = MapPlayer.fromEvent();
            let playerId = player.id;

            let units = this.inputHandler.GetPlayerSelectedUnitIds(player);
            if (units.length == 0) return;

            for (let u of units) {
                if (u.owner.id == playerId) {
                    toolManager.Unequip(u);
                }
            }
        });
    }

    Execute(e: AbilityEvent): boolean {
        
        let caster = e.caster;
        let level = e.abilityLevel;
        let target = e.targetDestructable;

        if (!target) return false;

        let dmg = 2
        switch (target.typeId) {
            case DestructableTypes.SummerTree:
                caster.damageTarget(target.handle, dmg, true, false, ATTACK_TYPE_NORMAL, DAMAGE_TYPE_NORMAL, WEAPON_TYPE_AXE_MEDIUM_CHOP);
        
                let item = this.itemFactory.CreateItemByType(ResourceItem.Branch);
                if (caster.addItem(item) == false)
                    item.setPosition(target.x, target.y);
        
                caster.addExperience(this.experience, true);
                break;

            case DestructableTypes.Log:
                item = this.itemFactory.CreateItemByType(ResourceItem.Log, target.x, target.y);
                caster.addItem(item);

                caster.addExperience(this.experience, true);
                target.kill();
                break;

            default:
                this.errorService.DisplayError(caster.owner, "Invalid target.");
        }

        // let rand = math.random();
        // // If widget has died, do drops
        // if (rand <= 0.60) {
            
        //     // Log.Info("Dropping");
        // }
        return true;
    }
    
    TooltipDescription = (unit: Unit) => 
`Interacts with an object.

Tree - obtain a Branch (wood material).`;
}