import { sharedPlayer } from "config/Config";
import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { Item, MapPlayer, Rectangle, Trigger, Unit } from "w3ts/index";

export interface NetEnsnareAbility extends Wc3Ability {
    itemAbilityCode: string,
}

export class NetEnsnare extends AbilityBase {

    private rect: Rectangle;

    constructor(
        data: NetEnsnareAbility,
        abilityEvent: IAbilityEventHandler,
    ) {
        super(data);
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));
        this.rect = new Rectangle(0, 0, 220, 220);

        let trg = new Trigger();
        trg.registerAnyUnitEvent(EVENT_PLAYER_UNIT_USE_ITEM);
        trg.addAction(() => this.ExecuteRelease());
    }

    ExecuteRelease(): void {

        let user = Unit.fromEvent();
        let item = Item.fromEvent();
        let typeId = this.itemTypeToUnit[item.typeId];
        print(typeId);

        if (!typeId) return;

        print(user.name);
        try {
            let unit = new Unit(MapPlayer.fromIndex(PLAYER_NEUTRAL_PASSIVE), typeId, user.x, user.y, 0);
        } catch (ex) {
            Log.Error(ex);
        }
        item.destroy();
    }

    Execute(e: AbilityEvent): void {
        
        let caster = e.caster;
        let target = e.targetUnit;
        let point = e.targetPoint;
        let typeId = target?.typeId;

        if (target && typeId) {
            let itemType = this.unitToItemType[typeId];
            let item = new Item(itemType, target.x, target.y);

            target.destroy();
        }
    }

    private unitToItemType: Record<number, number> = {
        [FourCC('nfro')]: FourCC('IA04'),
        [FourCC('nrat')]: FourCC('IA06'),
        [FourCC('necr')]: FourCC('IA00'),
        [FourCC('nskk')]: FourCC('IA03'),
        [FourCC('nder')]: FourCC('IA07'),
        [FourCC('ncrb')]: FourCC('IA02'),
        [FourCC('ndwm')]: FourCC('IA05'),
        [FourCC('nrac')]: FourCC('IA01'),
    }

    private itemTypeToUnit: Record<number, number> = {
        [FourCC('IA04')]: FourCC('nfro'),
        [FourCC('IA06')]: FourCC('nrat'),
        [FourCC('IA00')]: FourCC('necr'),
        [FourCC('IA03')]: FourCC('nskk'),
        [FourCC('IA07')]: FourCC('nder'),
        [FourCC('IA02')]: FourCC('ncrb'),
        [FourCC('IA05')]: FourCC('ndwm'),
        [FourCC('IA01')]: FourCC('nrac'),
    }
    
    TooltipDescription = undefined;
}