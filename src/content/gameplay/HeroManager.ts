import { Artisan, ArtisanAbilities } from "content/classes/Artisan";
import { PlayerClass } from "content/classes/PlayerClass";
import { Prospector, ProspectorAbilities } from "content/classes/Prospector";
import { Researcher, ResearcherAbilities } from "content/classes/Researcher";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { ToolManager } from "systems/tools/ToolManager";
import { Trigger, Unit } from "w3ts/index";

export const enum HeroType {
    Prospector,
    Artisan,
    Researcher,
}

export type HeroConfig = {

    name: string,
    unitCode: string,
    type: HeroType,
}

export class HeroManager {

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

            let id = FourCC(c.unitCode);
            this.unitTypeDef[id] = c;
        }

        let t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SELL);
        t.addAction(() => this.OnUnitSold());
    }

    private OnUnitSold() {
        
        let sold = Unit.fromHandle(GetSoldUnit());
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

        return null;
    }
}