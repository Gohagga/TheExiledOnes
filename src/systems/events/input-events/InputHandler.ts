import { MapPlayer, Trigger, Unit } from "w3ts/index";

export const enum MetaKey {
    None    = 0,
    Shift   = 1 << 0,
    Control = 1 << 1,
    Alt     = 1 << 2,
    Meta    = 1 << 3,
}

export class InputHandler {
    // IsCtrlDown(player: MapPlayer) {
    //     return this.isCtrlDown[player.id];
    // }

    // private isCtrlDown: Record<number, boolean> = {};
    // private shiftTrigger: Trigger = new Trigger();

    private selectedUnits: Record<number, Map<number, Unit>> = {};

    constructor(private readonly players: MapPlayer[]) {

        // for (let i = 0; i < numberOfPlayers; i++) {

            // this.shiftTrigger.registerPlayerKeyEvent(MapPlayer.fromIndex(i), OSKEY_LCONTROL, 2, true);
            // this.shiftTrigger.registerPlayerKeyEvent(MapPlayer.fromIndex(i), OSKEY_LCONTROL, 0, false);
        // }
        // this.shiftTrigger.addAction(() => {

        //     let isDown = BlzGetTriggerPlayerIsKeyDown();
        //     let playerId = MapPlayer.fromEvent().id;
        //     this.isCtrlDown[playerId] = isDown;
        //     // print("Shift event", isDown);
        // });

        let t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_SELECTED);
        t.addAction(() => {

            let player = MapPlayer.fromEvent();
            let id = player.id;
            let unit = Unit.fromEvent();
            if (id in this.selectedUnits == false) this.selectedUnits[id] = new Map<number, Unit>();
            let selected = this.selectedUnits[id];
            selected.set(unit.id, unit);
        });

        t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DESELECTED);
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DEATH)
        t.addAction(() => {

            let player = MapPlayer.fromEvent();
            let unit = Unit.fromEvent();
            let id = player.id;
            if (id in this.selectedUnits == false) return;
            let selected = this.selectedUnits[id];
            selected.delete(unit.id);
        });
    }

    public GetPlayerSelectedUnitIds(player: MapPlayer) {
        let id = player.id;
        if (!this.selectedUnits[id]) return [];
        let values = this.selectedUnits[id].values();
        return [...values];
    }

    ClearPlayerSelection(player: MapPlayer) {
        let id = player.id;
        if (id in this.selectedUnits == false) return;
        delete this.selectedUnits[id];
        ClearSelectionForPlayer(player.handle);
    }

    public RegisterAllPlayerKeyEvent(trigger: Trigger, key: oskeytype, meta: MetaKey, keyDown: boolean) {
        for (let player of this.players) {
            trigger.registerPlayerKeyEvent(player, key, meta, keyDown);
        }
    }


    // IsCtrlDown(player: MapPlayer) {
    //     return this.isCtrlDown[player.id];
    // }
}