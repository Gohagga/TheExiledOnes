import { sharedPlayer } from "Config";
import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { Item, Rectangle, Unit } from "w3ts/index";
export class TransferInventory extends AbilityBase {

    private rect: Rectangle;

    constructor(
        data: Wc3Ability,
        abilityEvent: IAbilityEventHandler,
    ) {
        super(data);
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));
        this.rect = new Rectangle(0, 0, 220, 220);
    }

    Execute(e: AbilityEvent): void {
        
        try {
            let caster = e.caster;
            let target = e.targetUnit;
            let point = e.targetPoint;

            let casterItems = this.GetUnitItems(caster);
            Log.Info("caster has items", casterItems.length)

            // In case of empty inventory, pick up
            if (casterItems.length > 0) {

                if (target) {
    
                    Log.Info("There is target");
                    for (let it of casterItems) {
                        if (!target.addItem(it))
                            break;
                    }
                    return;
                } else {
                    for (let it of casterItems) {
                        it.setPoint(point);
                    }
                }

            } else {

                if (target) {
                    let owner = target.owner.id;
                    if (owner == caster.owner.id ||
                        owner == sharedPlayer.id
                    ) {
                        let targetItems = this.GetUnitItems(target);
                        for (let it of targetItems) {
                            if (!caster.addItem(it))
                                break;
                        }
                        return;
                    }
                } else {
                    this.rect.movePoint(point);
                    let taking = true;
                    let items = EnumItemsInRect(this.rect.handle, null, () => {
                        if (taking) taking = caster.addItem(Item.fromHandle(GetEnumItem()));
                    });
                }
            }
    
        } catch (ex) {
            Log.Error(ex);
        }
    }

    GetUnitItems(unit: Unit) {
        
        let items: Item[] = [];
        
        for (let i = 5; i >= 0; i--) {
            let it = UnitItemInSlot(unit.handle, i);
            if (it) items.push(Item.fromHandle(it));
        }

        return items;
    }
    
    TooltipDescription = undefined;
}