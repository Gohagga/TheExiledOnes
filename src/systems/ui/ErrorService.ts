import { MapPlayer, Sound } from "w3ts/index";

export class ErrorService {

    private errorSound: Sound;
    constructor() {
        this.errorSound = Sound.fromHandle(CreateSoundFromLabel('InterfaceError', false, false, false, 10, 10));
    }

    DisplayError(player: MapPlayer, message: string) {

        message = `\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n|cffffcc00${message}|r`;
        if (GetLocalPlayer() == player.handle) {
            ClearTextMessages();
            DisplayTimedTextToPlayer(player.handle, 0.51, 0.96, 2, message);
            this.errorSound.start();
        }

        // set error = "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n|cffffcc00"+error+"|r"
        // if GetLocalPlayer()==whichPlayer then
        //     call ClearTextMessages()
        //     call DisplayTimedTextToPlayer(whichPlayer,0.52,0.96,2,error)
        //     call StartSound(udg_ErrorSound)
        // endif
    }
}