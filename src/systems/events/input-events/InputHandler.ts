import { MapPlayer, Trigger } from "w3ts/index";

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