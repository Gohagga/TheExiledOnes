import { Config } from "Config";
import { Level, Log } from "Log";
import { MapGenerator } from "systems/map-generation/MapGenerator";
import { HeightNoiseProvider } from "systems/map-generation/providers/HeightNoise";
import { TreeNoiseProvider } from "systems/map-generation/providers/TreeNoise";
import { Random } from "systems/random/Random";
import { CameraSetup, MapPlayer, Timer, Trigger } from "w3ts/index";

export function Initialize() {

    const config = new Config();

    Log.Level = Level.All;

    // const seed = 5;
    const seed = 6;
    const random = new Random(seed);

    const heightNoise = new HeightNoiseProvider(random);
    const treeNoise = new TreeNoiseProvider(random);
    const mapGenerator = new MapGenerator(heightNoise, treeNoise, random);

    mapGenerator.resume();

    const tim = new Timer()
    tim.start(0.2, true, () => {
        if (mapGenerator.isDone)
            tim.destroy();
        else
            mapGenerator.resume();
    });

    let cam = new Trigger();
    cam.registerPlayerChatEvent(MapPlayer.fromLocal(), '-cam ', false);
    cam.addAction(() => {
        print("EVENT");
        let str = GetEventPlayerChatString();
        let number: number;
        let ind = 0;
        if (str.startsWith('-cam '))
            ind = 4;
        else if (str.startsWith('-zoom '))
            ind = 5;
        number = Number(str.substring(ind, 10).trim());
        print("Camera distance set to ", number);
        SetCameraFieldForPlayer(MapPlayer.fromEvent().handle, CAMERA_FIELD_TARGET_DISTANCE, number, 0.5);
        SetCameraFieldForPlayer(MapPlayer.fromEvent().handle, CAMERA_FIELD_FARZ, 100000, 0.5);
    });

    SetCameraFieldForPlayer(MapPlayer.fromIndex(0).handle, CAMERA_FIELD_TARGET_DISTANCE, 8600, 0.5);
    SetCameraFieldForPlayer(MapPlayer.fromIndex(0).handle, CAMERA_FIELD_FARZ, 100000, 0.5);
}