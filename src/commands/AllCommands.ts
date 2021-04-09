import { Config, sharedPlayer } from "config/Config";
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

    // Die
    CreateChatCommand(players, ["-die"], true, () => {
        let triggerPlayer = MapPlayer.fromEvent();
        let triggerPlayerId = triggerPlayer.id;
        let units = inputHandler.GetPlayerSelectedUnitIds(triggerPlayer);

        if (units.length > 1) return;
        let hero = units[0];

        if (hero.owner != triggerPlayer || !hero.isHero) return;

        for (let i = 0; i < 6; i++) {
            RemoveItem(UnitItemInSlot(hero.handle, i));
        }
        hero.kill();
    });
}

function CreateChatCommand(players: MapPlayer[], message: string[], exact: boolean, action: () => void): Trigger {

    let t = new Trigger();
    for (let p of players) {
        for (let i = 0; i < message.length; i++) {
            t.registerPlayerChatEvent(p, message[i], exact);
        }
    }
    t.addAction(action);
    return t;
}