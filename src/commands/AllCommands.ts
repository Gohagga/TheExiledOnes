import { Config, enemyPlayer, Global, sharedPlayer } from "config/Config";
import { HeroManager } from "content/gameplay/HeroManager";
import { ComponentItem, ResourceItem } from "content/items/ResourceItem";
import { Log } from "Log";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { InputHandler } from "systems/events/input-events/InputHandler";
import { ItemFactory } from "systems/items/ItemFactory";
import { OrderId } from "w3ts/globals/order";
import { MapPlayer, Timer, Trigger, Unit } from "w3ts/index";

export function InitCommands(
    config: Config,
    inputHandler: InputHandler,
    abilityEvent: IAbilityEventHandler,
    basicSlotManager: AbilitySlotManager,
    specialSlotManager: AbilitySlotManager,
    heroManager: HeroManager,
    itemFactory: ItemFactory
) {

    let originalUnitOwner: Record<number, number> = {};

    let t = new Trigger();
    let players = config.players;
    for (let p of players) {
        t.registerPlayerChatEvent(p, '-share', true);
        t.registerPlayerChatEvent(p, '-unshare', true);
    }
    t.addAction(() => {

        try {
            let triggerPlayer = MapPlayer.fromEvent();
            let triggerPlayerId = triggerPlayer.id;
            let units = inputHandler.GetPlayerSelectedUnitIds(triggerPlayer);
    
            if (GetEventPlayerChatString() == '-share') {
    
                for (let u of units) {
    
                    if (triggerPlayerId == u.owner.id && (!u.isHero() || u.id == Global.soulAnchor.id)) {
    
                        u.setOwner(sharedPlayer, true);
                        basicSlotManager.UpdateSpellList(u);
                        specialSlotManager.UpdateSpellList(u);
                        originalUnitOwner[u.id] = triggerPlayerId;
                    }
                }
                
            } else if (GetEventPlayerChatString() == '-unshare') {
    
                for (let u of units) {
                    if (triggerPlayer.id == originalUnitOwner[u.id] && (!u.isHero() || u.id == Global.soulAnchor.id)) {
                        u.setOwner(triggerPlayer, true);
                    }
                }
            }
        } catch (ex) {
            print(ex);
        }
    });

    originalUnitOwner[Global.soulAnchor.id] = 0;

    CreateChatCommand(players, ["-clear select"], true, () => {
        let triggerPlayer = MapPlayer.fromEvent();
        let triggerPlayerId = triggerPlayer.id;
        let units = inputHandler.ClearPlayerSelection(triggerPlayer);
    });

    Log.Info("registered")

    
    // Die
    CreateChatCommand(players, ["-die"], true, () => {
        
        let triggerPlayer = MapPlayer.fromEvent();
        heroManager.RemoveHero(triggerPlayer);
    });
    
    CreateChatCommand(players, ["-smolpp"], true, () => {
        
        let triggerPlayer = MapPlayer.fromEvent();
        let cheatUnit = new Unit(triggerPlayer, FourCC('H001'), 0, 0, 0);
    });
    
    const unitCountAbilityId = FourCC('A00X');
    abilityEvent.OnAbilityEffect(unitCountAbilityId, (e: AbilityEvent) => {
        return e.caster.incAbilityLevel(unitCountAbilityId) > 0;
    });

    let reduceUnitCountTrg = new Trigger();
    reduceUnitCountTrg.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_ORDER);
    reduceUnitCountTrg.addAction(() => {
        if (GetIssuedOrderId() != OrderId.Replenishlifeon &&
            GetIssuedOrderId() != OrderId.Replenishlifeoff)
            return;

        let caster = Unit.fromEvent();
        caster.decAbilityLevel(unitCountAbilityId);
    });

    const enemyPortalAbilityId = FourCC('A00Y');
    abilityEvent.OnAbilityEffect(enemyPortalAbilityId, (e: AbilityEvent) => {
        const caster = e.caster;
        let unitCount = caster.getAbilityLevel(unitCountAbilityId);
        let timer = new Timer();
        let portal = new Unit(enemyPlayer, FourCC('h006'), e.targetPoint.x, e.targetPoint.y, 270);
        portal.setAnimation('birth');
        timer.start(5, false, () => {

            timer.start(1, true, () => {
    
                // Create enemy unit and order them to attack position of soul anchor
                // let u = new Unit(enemyPlayer, FourCC('h005'), e.targetPoint.x, e.targetPoint.y, 0);
                portal.issueImmediateOrder(FourCC('h005'));
                if (--unitCount == 0) {
                    timer.destroy();
                    portal.applyTimedLife(FourCC('B000'), 2);
                }
            });
        });
        return true;
    });

    CreateChatCommand([MapPlayer.fromIndex(0)], ['-lvl'], true, () => {
        let triggerPlayer = MapPlayer.fromEvent();
        let triggerPlayerId = triggerPlayer.id;
        let units = inputHandler.GetPlayerSelectedUnitIds(triggerPlayer);
        if (units.length > 0)
            units[0].setHeroLevel(units[0].level + 1, true);
    });

    CreateChatCommand(players, ['-secondchance'], true, () => {
        Global.soulAnchor.addAbility(FourCC('A00Z'));
    });

    CreateChatCommand(players, ['-getrich'], true, () => {
        itemFactory.CreateItemByType(ResourceItem.WoodII, Global.soulAnchor.x, Global.soulAnchor.y);
        itemFactory.CreateItemByType(ResourceItem.WoodII, Global.soulAnchor.x, Global.soulAnchor.y);
        itemFactory.CreateItemByType(ResourceItem.StoneII, Global.soulAnchor.x, Global.soulAnchor.y);
        itemFactory.CreateItemByType(ResourceItem.StoneII, Global.soulAnchor.x, Global.soulAnchor.y);
        itemFactory.CreateItemByType(ComponentItem.FrameI, Global.soulAnchor.x, Global.soulAnchor.y);
        itemFactory.CreateItemByType(ComponentItem.FrameI, Global.soulAnchor.x, Global.soulAnchor.y);
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