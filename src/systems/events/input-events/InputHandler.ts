import { MapPlayer, Trigger, Unit } from "w3ts/index";

export const enum MetaKey {
    None    = 0,
    Shift   = 1 << 0,
    Control = 1 << 1,
    Alt     = 1 << 2,
    Meta    = 1 << 3,
}

export class InputHandler {

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
            print("player selected", player.name);
            let id = player.id;
            let unit = Unit.fromEvent();
            if (id in this.selectedUnits == false) this.selectedUnits[id] = new Map<number, Unit>();
            let selected = this.selectedUnits[id];
            selected.set(unit.id, unit);
            print(this.selectedUnits[id].size);
        });

        t = new Trigger();
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_DESELECTED);
        t.addAction(() => {

            let player = MapPlayer.fromEvent();
            print("player deselected", player.name);
            let unit = Unit.fromEvent();
            let id = player.id;
            let selected = this.selectedUnits[id];
            selected.delete(unit.id);
            print(this.selectedUnits[id].size);
        });
    }

    public GetPlayerSelectedUnitIds(player: MapPlayer) {
        let id = player.id;
        if (!this.selectedUnits[id]) return [];
        let values = this.selectedUnits[id].values();
        return [...values];
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