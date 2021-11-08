import { sharedPlayer } from "config/Config";
import { OreType } from "config/OreType";
import { ResourceItem } from "content/items/ResourceItem";
import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { IItemFactory } from "systems/items/IItemFactory";
import { ErrorService } from "systems/ui/ErrorService";
import { Item, MapPlayer, Rectangle, Timer, Trigger, Unit } from "w3ts/index";

export interface QuarryMineAbility extends Wc3Ability {
    mineInterval: number,
    felCostPerStone: number,
}

export class QuarryMine extends AbilityBase {

    private instance: Record<number, Timer> = {};

    private mineInterval: number;
    private felCostPerStone: number;

    constructor(
        data: QuarryMineAbility,
        abilityEvent: IAbilityEventHandler,
        private readonly itemFactory: IItemFactory,
        private readonly errorService: ErrorService,
    ) {
        super(data);
        this.mineInterval = data.mineInterval;
        this.felCostPerStone = data.felCostPerStone;

        // abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));

        // let t = new Trigger();
        // t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SPELL_ENDCAST);
        // t.addAction(() => this.EndChannel());
    }

    EndChannel(): void {
        
        let caster = Unit.fromEvent();
        let casterId = caster.id;
        this.instance[casterId].destroy();
        delete this.instance[casterId];
    }

    Execute(e: AbilityEvent): boolean {
        
        let caster = e.caster;
        let target = e.targetDestructable;
        let typeId = target && target.typeId;

        if (!target || typeId != OreType.StoneQuarry) {
            return false;
        }

        this.StartMining(caster);
        
        return true;
    }

    StartMining(caster: Unit) {

        let casterId = caster.id;
        this.instance[casterId] = this.instance[casterId] || new Timer();
        this.instance[casterId].pause();
        this.instance[casterId].start(this.mineInterval, true, () => {
            
            if (caster.mana < this.felCostPerStone) {
                this.errorService.TextTagError("Out of fuel", caster.x, caster.y);
                return;
            }

            caster.mana -= this.felCostPerStone;
            let item =  this.itemFactory.CreateItemByType(ResourceItem.StoneII, caster.x, caster.y);
            caster.addItem(item);
        });
    }

    TooltipDescription = undefined;

}