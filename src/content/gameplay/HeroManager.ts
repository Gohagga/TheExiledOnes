import { Artisan2, Artisan2Abilities } from "content/classes/Artisan2";
import { PlayerClass } from "content/classes/PlayerClass";
import { Prospector, ProspectorAbilities } from "content/classes/Prospector";
import { Researcher, ResearcherAbilities } from "content/classes/Researcher";
import { Log } from "Log";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { RecordEventHandler } from "systems/events/generic/RecordEventHandler";
import { ToolManager } from "systems/tools/ToolManager";
import { MapPlayer, Trigger, Unit } from "w3ts/index";

export enum HeroType {
    Prospector          = FourCC('H00P'),
    Artisan             = FourCC('H00A'),
    Researcher          = FourCC('H00R'),
}

export type HeroConfig = {

    name: string,
    unitId: number,
    type: HeroType,
}

export class HeroManager {

    public readonly playerHero: Map<number, Unit> = new Map<number, Unit>();
    private unitTypeDef: Record<number, HeroConfig> = {};

    constructor(
        config: HeroConfig[],
        private basicSlotManager: AbilitySlotManager,
        private specialSlotManager: AbilitySlotManager,
        private sharedSlotManager: AbilitySlotManager,
        private toolManager: ToolManager,
    ) {
        
        for (let c of config) {

            this.unitTypeDef[c.unitId] = c;
        }
    }

    public Initialize(abilities:
        ProspectorAbilities &
        Artisan2Abilities &
        ResearcherAbilities
    ) {
        let t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SELL);
        t.addAction(() => this.OnUnitSold(abilities));

        t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
        t.addAction(() => {
            let unit = Unit.fromEvent();
            if (unit.isHero()) {

                this.toolManager.Unequip(unit);
                for (let i = 0; i < 6; i++) {
                    UnitRemoveItemFromSlot(unit.handle, i);
                }

                unit.setOwner(MapPlayer.fromIndex(PLAYER_NEUTRAL_PASSIVE), false);
                unit.applyTimedLife(FourCC('B000'), 2)
            }
        });
    }

    private OnUnitSold(abilities:
        ProspectorAbilities &
        Artisan2Abilities &
        ResearcherAbilities
    ) {
        
        try {
            let sold = Unit.fromHandle(GetSoldUnit());
            let playerId = sold.owner.id;
            let typeId = sold.typeId;

            if (typeId in this.unitTypeDef == false) return null;

            let config = this.unitTypeDef[typeId];

            let playerClass: PlayerClass | null = null;

            switch (config.type) {
                case HeroType.Artisan:
                    playerClass = new Artisan2(sold, abilities, this.basicSlotManager, this.specialSlotManager, this.sharedSlotManager, this.toolManager);
                    break;
                case HeroType.Prospector:
                    playerClass = new Prospector(sold, abilities, this.basicSlotManager, this.specialSlotManager, this.sharedSlotManager, this.toolManager);
                    break;
                case HeroType.Researcher:
                    playerClass = new Researcher(sold, abilities, this.basicSlotManager, this.specialSlotManager, this.sharedSlotManager, this.toolManager);
                    break;
                default:
                    throw null;
            }

            this.playerHero.set(playerId, sold);
            return playerClass;

        } catch (ex: any) {
            Log.Error(ex);
        }

        return null;
    }

    public RemoveHero(player: MapPlayer) {

        let playerId = player.id;
        if (this.playerHero.has(playerId)) {

            let hero = this.playerHero.get(playerId) as Unit;
            hero.kill();
        }

        this.playerHero.delete(playerId);
    }
}