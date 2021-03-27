import { Config } from "Config";
import { Defile } from "content/abilities/prospector/Defile";
import { Prospector } from "content/classes/Prospector";
import { Level, Log } from "Log";
import { BasicAbility } from "systems/abilities/BasicAbility";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { AbilityEventHandler } from "systems/events/ability-events/AbilityEventHandler";
import { AbilityEventProvider } from "systems/events/ability-events/AbilityEventProvider";
import { MapGenerator } from "systems/map-generation/MapGenerator";
import { MapGenerator2 } from "systems/map-generation/MapGenerator2";
import { CavernNoiseProvider } from "systems/map-generation/providers/CavernNoiseProvider";
import { HeightNoiseProvider } from "systems/map-generation/providers/HeightNoise";
import { MoistureNoiseProvider } from "systems/map-generation/providers/MoistureNoise";
import { TreeNoiseProvider } from "systems/map-generation/providers/TreeNoise";
import { CustomMinimap } from "systems/minimap/CustomMinimap";
import { Minimap } from "systems/minimap/Minimap";
import { Random } from "systems/random/Random";
import { ErrorService } from "systems/ui/ErrorService";
import { CameraSetup, MapPlayer, Rectangle, Timer, Trigger, Unit } from "w3ts/index";

export function Initialize() {

    const config = new Config();

    // Abilities
    const abilityEvent = new AbilityEventHandler();
    const abilityEventProvider = new AbilityEventProvider(abilityEvent);
    const slotManager = new AbilitySlotManager();
    const errorService = new ErrorService();

    Log.Level = Level.All;

    // const seed = 5;
    const seed = 6;
    const random = new Random(seed);
    
    // mapGenerator.resume();
    FogModifierStart(CreateFogModifierRect(Player(0), FOG_OF_WAR_VISIBLE, GetPlayableMapRect(), true, true));
    
    const tim1 = new Timer();
    tim1.start(0, false, () => {

        const surfaceRect = Rectangle.fromHandle(gg_rct_SurfaceMap);
        const undergroundRect = Rectangle.fromHandle(gg_rct_UndergroundMap);
        // SetCameraBoundsToRect(gg_rct_SurfaceMap);

        // let xMaxBound = GetRectMaxX(GetWorldBounds());
        // let xMinBound = GetRectMinX(GetWorldBounds());
        // let yMaxBound = GetRectMaxY(GetWorldBounds());
        // let yMinBound = GetRectMinY(GetWorldBounds());
        // let widthBound = xMaxBound - xMinBound;
        // let heightBound = yMaxBound - yMinBound;

        // let padding = 128 * 6;
        // let boxSide = math.floor(widthBound - padding) * 0.5;
        // surfaceRect.setRect(boxSide + padding, yMaxBound - 128, xMaxBound - 128, yMaxBound - 128 - boxSide);

        // Log.Info(surfaceRect.minX, surfaceRect.minY, surfaceRect.maxX, surfaceRect.maxY);

        const heightNoise = new HeightNoiseProvider(random);
        const minimap = new CustomMinimap(surfaceRect);
        const treeNoise = new TreeNoiseProvider(random);
        const moistureNoise = new MoistureNoiseProvider(random);
        const cavernNoise = new CavernNoiseProvider(random);
        const mapGenerator = new MapGenerator2(minimap, heightNoise, treeNoise, moistureNoise, cavernNoise, surfaceRect, undergroundRect, random);
        // const mapGenerator = new MapGenerator(
        //     minimap,
        //     heightNoise,
        //     treeNoise, 
        //     moistureNoise, 
        //     cavernNoise, 
        //     surfaceRect, 
        //     Rectangle.fromHandle(gg_rct_UndergroundMap), 
        //     random);

        
        abilityEvent.OnAbilityCast(FourCC('A000'), () => {
            // Log.Info("Terrain height:", mapGenerator.heightBuilder.getHeight(GetSpellTargetX(), GetSpellTargetY()));
        });
    
        let time = os.clock();
        mapGenerator.resume();

        const tim = new Timer()
        const progressTim = new Timer();
        tim.start(0.02, true, () => {
            if (mapGenerator.isDone) {
                tim.destroy();
                progressTim.destroy();
                time = os.clock() - time;

                Log.Info("Finished generating in ", time);
                // EnumDestructablesInRectAll(Rect(p.x-100, p.y-100, p.x+100, p.y+100), () => {
                    //     if (GetEnumDestructable())
                    //         nearDestruct = true;
                    // });
                    
            } else
                mapGenerator.resume();
        });
        progressTim.start(1, true, () => {
            ClearTextMessages();
            let passed = math.floor(os.clock() - time + 0.5);
            let prediction = passed / mapGenerator.progress;
            Log.Info("Progress: ", math.floor(mapGenerator.progress * 100 + 0.5) + '%', "seconds passed: ", passed, "prediction: ", prediction);
        });
    });

    // let abilities = {
    //     ProspectorSpellbook: new BasicAbility(config.ProspectorSpellbook),
    //     Defile: new Defile(config.Defile, abilityEvent, errorService),
    //     EyeOfKilrogg: new BasicAbility(config.EyeOfKilrogg),
    //     InfuseFelstone: new BasicAbility(config.InfuseFelstone),
    //     CrystalizeFel: new BasicAbility(config.CrystalizeFel),
    //     Demonfruit: new BasicAbility(config.Demonfruit),
    //     TransferFel: new BasicAbility(config.TransferFel),
    //     PrepareFelCollector: new BasicAbility(config.PrepareFelCollector)
    // }
    
    // abilities.ProspectorSpellbook.AddToUnit(u);
    // p.setAbilityAvailable(abilities.Defile.extId as number, false);
    // p.setAbilityAvailable(abilities.EyeOfKilrogg.extId as number, false);
    // p.setAbilityAvailable(abilities.InfuseFelstone.extId as number, false);

    // abilities.Defile.AddToUnit(u, true);
    // abilities.EyeOfKilrogg.AddToUnit(u, true);
    // abilities.InfuseFelstone.AddToUnit(u, true);

    
    
    let onGameStartTimer = new Timer();
    onGameStartTimer.start(0, false, () => {

        // // Make players
        // let startPoint = { x: 0, y: 0 };
        // SetPlayerAlliance(Player(15), Player(0), ALLIANCE_SHARED_CONTROL, true);
        // SetPlayerAllianceStateBJ(Player(0), Player(15), bj_ALLIANCE_ALLIED);
        // let u = new Unit(MapPlayer.fromIndex(15), FourCC('e000'), startPoint.x, startPoint.y, 270);

        // let p = MapPlayer.fromIndex(0);
        // u = Unit.fromHandle(gg_unit_Hblm_0003);
        // let pc = new Prospector(u, abilities, slotManager);
    
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