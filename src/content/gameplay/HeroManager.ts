import { Artisan, ArtisanAbilities } from "content/classes/Artisan";
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
        private abilities:
            ProspectorAbilities &
            ArtisanAbilities,
            // ResearcherAbilities,
        private basicSlotManager: AbilitySlotManager,
        private specialSlotManager: AbilitySlotManager,
        private toolManager: ToolManager,
    ) {
        
        for (let c of config) {

            this.unitTypeDef[c.unitId] = c;
        }

        let t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SELL);
        t.addAction(() => this.OnUnitSold());

        t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH);
        t.addAction(() => {
            let unit = Unit.fromEvent();
            if (unit.isHero()) {
                unit.setOwner(MapPlayer.fromIndex(PLAYER_NEUTRAL_PASSIVE), false);
                unit.applyTimedLife(FourCC('B000'), 2)
            }
        })
    }

    private OnUnitSold() {
        
        try {
            let sold = Unit.fromHandle(GetSoldUnit());
            let playerId = sold.owner.id;
            let typeId = sold.typeId;

            if (typeId in this.unitTypeDef == false) return null;

            let config = this.unitTypeDef[typeId];

            let playerClass: PlayerClass;

            switch (config.type) {
                case HeroType.Artisan:
                    return playerClass = new Artisan(sold, this.abilities, this.basicSlotManager, this.specialSlotManager, this.toolManager);
                case HeroType.Prospector:
                    return playerClass = new Prospector(sold, this.abilities, this.basicSlotManager, this.specialSlotManager, this.toolManager);
                // case HeroType.Researcher:
                //     return playerClass = new Researcher(sold, this.abilities, this.basicSlotManager, this.specialSlotManager, this.toolManager);
            }

            if (this.playerHero.has(playerId)) {
                this.playerHero.get(playerId)?.destroy();
                this.playerHero.set(playerId, sold);
            }
        } catch (ex) {
            Log.Error(ex);
        }

        return null;
    }
}