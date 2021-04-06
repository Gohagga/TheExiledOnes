import { Config, sharedPlayer } from "Config";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { InputHandler } from "systems/events/input-events/InputHandler";
import { MapPlayer, Trigger } from "w3ts/index";

export function InitCommands(
    config: Config,
    inputHandler: InputHandler,
    basicSlotManager: AbilitySlotManager,
    specialSlotManager: AbilitySlotManager,
) {

    let originalUnitOwner: Record<number, number> = {};

    let t = new Trigger();
    let players = config.players;
    for (let p of players) {
        t.registerPlayerChatEvent(p, '-share', true);
        t.registerPlayerChatEvent(p, '-unshare', true);
    }
    t.addAction(() => {

        let triggerPlayer = MapPlayer.fromEvent();
        let triggerPlayerId = triggerPlayer.id;
        let units = inputHandler.GetPlayerSelectedUnitIds(triggerPlayer);

        if (GetEventPlayerChatString() == '-share') {

            for (let u of units) {

                if (triggerPlayerId == u.owner.id && !u.isHero()) {

                    u.setOwner(sharedPlayer, true);
                    basicSlotManager.UpdateSpellList(u);
                    specialSlotManager.UpdateSpellList(u);
                    originalUnitOwner[u.id] = triggerPlayerId;
                }
            }
            
        } else if (GetEventPlayerChatString() == '-unshare') {

            for (let u of units) {
                if (triggerPlayer.id == originalUnitOwner[u.id] && !u.isHero()) {
                    u.setOwner(triggerPlayer, true);
                }
            }
        }
    });
}