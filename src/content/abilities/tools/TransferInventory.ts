import { sharedPlayer } from "config/Config";
import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { Item, Rectangle, Unit } from "w3ts/index";
import { Depot } from "../researcher/Depot";
export class TransferInventory extends AbilityBase {

    private rect: Rectangle;

    constructor(
        data: Wc3Ability,
        abilityEvent: IAbilityEventHandler,
        private readonly depot: Depot
    ) {
        super(data);
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));
        this.rect = new Rectangle(0, 0, 220, 220);
    }

    Execute(e: AbilityEvent): boolean {
        
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
                    if (target.typeId == FourCC('u000')) {
                        
                        // Custom handling for Depot
                        let storedItem = UnitItemInSlot(target.handle, 0);
                        let storedItemType = -1;
                        if (storedItem) storedItemType = GetItemTypeId(storedItem);
                        else storedItemType = casterItems[0].typeId;

                        for (let it of casterItems) {
                            if (it.typeId == storedItemType && !target.addItem(it))
                                break;
                        }

                    } else {

                        for (let it of casterItems) {
                            if (!target.addItem(it))
                                break;
                        }
                    }
                    return true;
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

                        if (target.typeId == FourCC('u000')) {

                            // Custom handling for Depot
                            for (let i = 0; i < 6; i++) {
                                let it = this.depot.RequestItem(target);
                                if (it == null || !caster.addItem(it))
                                    break;
                            }
                        } else {
                            
                            let targetItems = this.GetUnitItems(target);
                            for (let it of targetItems) {
                                if (!caster.addItem(it))
                                    break;
                            }
                        }

                        return true;
                    }
                } else {
                    this.rect.movePoint(point);
                    let taking = true;
                    EnumItemsInRect(this.rect.handle, null, () => {
                        if (taking) taking = caster.addItem(Item.fromHandle(GetEnumItem()));
                    });
                }
            }
    
        } catch (ex) {
            Log.Error(ex);
        }
        return true;
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