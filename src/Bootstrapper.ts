import { Config } from "Config";
import { Defile } from "content/abilities/prospector/Defile";
import { Prospector } from "content/classes/Prospector";
import { Level, Log } from "Log";
import { BasicAbility } from "systems/abilities/BasicAbility";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { AbilityEventHandler } from "systems/events/ability-events/AbilityEventHandler";
import { AbilityEventProvider } from "systems/events/ability-events/AbilityEventProvider";
import { MapGenerator } from "systems/map-generation/MapGenerator";
import { HeightNoiseProvider } from "systems/map-generation/providers/HeightNoise";
import { MoistureNoiseProvider } from "systems/map-generation/providers/MoistureNoise";
import { TreeNoiseProvider } from "systems/map-generation/providers/TreeNoise";
import { Random } from "systems/random/Random";
import { ErrorService } from "systems/ui/ErrorService";
import { CameraSetup, MapPlayer, Timer, Trigger, Unit } from "w3ts/index";

export function Initialize() {

    const config = new Config();

    Log.Level = Level.All;

    const seed = 5;
    // const seed = 6;
    const random = new Random(seed);

    // const heightNoise = new HeightNoiseProvider(random);
    // const treeNoise = new TreeNoiseProvider(random);
    // const moistureNoise = new MoistureNoiseProvider(random);
    // const mapGenerator = new MapGenerator(heightNoise, treeNoise, moistureNoise, random);
    
    // mapGenerator.resume();

    // Abilities
    const abilityEvent = new AbilityEventHandler();
    const abilityEventProvider = new AbilityEventProvider(abilityEvent);
    const slotManager = new AbilitySlotManager();
    const errorService = new ErrorService();

    // const tim = new Timer()
    // tim.start(0.2, true, () => {
    //     ClearTextMessages();
    //     Log.Info("Progress: ", math.floor(mapGenerator.progress * 100 + 0.5) + '%');
    //     if (mapGenerator.isDone) {
    //         tim.destroy();

    //         // EnumDestructablesInRectAll(Rect(p.x-100, p.y-100, p.x+100, p.y+100), () => {
    //         //     if (GetEnumDestructable())
    //         //         nearDestruct = true;
    //         // });

    //     }
    //     else
    //         mapGenerator.resume();
    // });

    let abilities = {
        ProspectorSpellbook: new BasicAbility(config.ProspectorSpellbook),
        Defile: new Defile(config.Defile, abilityEvent, errorService),
        EyeOfKilrogg: new BasicAbility(config.EyeOfKilrogg),
        InfuseFelstone: new BasicAbility(config.InfuseFelstone),
        CrystalizeFel: new BasicAbility(config.CrystalizeFel),
        Demonfruit: new BasicAbility(config.Demonfruit),
        TransferFel: new BasicAbility(config.TransferFel),
        PrepareFelCollector: new BasicAbility(config.PrepareFelCollector)
    }
    
    // abilities.ProspectorSpellbook.AddToUnit(u);
    // p.setAbilityAvailable(abilities.Defile.extId as number, false);
    // p.setAbilityAvailable(abilities.EyeOfKilrogg.extId as number, false);
    // p.setAbilityAvailable(abilities.InfuseFelstone.extId as number, false);

    // abilities.Defile.AddToUnit(u, true);
    // abilities.EyeOfKilrogg.AddToUnit(u, true);
    // abilities.InfuseFelstone.AddToUnit(u, true);

    
    
    let onGameStartTimer = new Timer();
    onGameStartTimer.start(0, false, () => {

        // Make players
        let startPoint = { x: 0, y: 0 };
        SetPlayerAlliance(Player(15), Player(0), ALLIANCE_SHARED_CONTROL, true);
        SetPlayerAllianceStateBJ(Player(0), Player(15), bj_ALLIANCE_ALLIED);
        let u = new Unit(MapPlayer.fromIndex(15), FourCC('e000'), startPoint.x, startPoint.y, 270);

        let p = MapPlayer.fromIndex(0);
        u = Unit.fromHandle(gg_unit_Hblm_0003);
        let pc = new Prospector(u, abilities, slotManager);
    
        let cam = new Trigger();
        cam.registerPlayerChatEvent(MapPlayer.fromLocal(), '-cam', false);
        cam.addAction(() => {
            print("EVENT");
            let str = GetEventPlayerChatString();
            let number: number;
            let ind = 0;
            if (str.startsWith('-cam '))
                ind = 4;
            // else if (str.startsWith('-cam'))
            //     ind = 4
            else if (str.startsWith('-zoom '))
                ind = 5;
            number = Number(str.substring(ind, 10).trim());
            if (str = "") {
                number = 6000;
            }
            print("Camera distance set to ", number);
            SetCameraFieldForPlayer(MapPlayer.fromEvent().handle, CAMERA_FIELD_TARGET_DISTANCE, number, 0.5);
            SetCameraFieldForPlayer(MapPlayer.fromEvent().handle, CAMERA_FIELD_FARZ, 100000, 0.5);
        });
    
        SetCameraFieldForPlayer(MapPlayer.fromIndex(0).handle, CAMERA_FIELD_TARGET_DISTANCE, 8600, 0.5);
        SetCameraFieldForPlayer(MapPlayer.fromIndex(0).handle, CAMERA_FIELD_FARZ, 100000, 0.5);
    });
    onGameStartTimer.destroy();
}