import { Config } from "Config";
import { CrudeAxe } from "content/abilities/artisan/CrudeAxe";
import { CrudePickaxe } from "content/abilities/artisan/CrudePickaxe";
import { Transmute } from "content/abilities/artisan/Transmute";
import { Workstation } from "content/abilities/artisan/Workstation";
import { Defile } from "content/abilities/prospector/Defile";
import { Axe } from "content/abilities/tools/Axe";
import { Pickaxe } from "content/abilities/tools/Pickaxe";
import { Artisan } from "content/classes/Artisan";
import { Prospector } from "content/classes/Prospector";
import { ResourceItem } from "content/items/ResourceItem";
import { WorkstationMachine } from "content/machines/WorkstationMachine";
import { Level, Log } from "Log";
import { PathingService } from "services/PathingService";
import { BasicAbility } from "systems/abilities/BasicAbility";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { Material } from "systems/crafting/Material";
import { AbilityEventHandler } from "systems/events/ability-events/AbilityEventHandler";
import { AbilityEventProvider } from "systems/events/ability-events/AbilityEventProvider";
import { PathingType } from "systems/map-generation/builders/PathingBuilder";
import { MapGenerator } from "systems/map-generation/MapGenerator";
import { MapGenerator2 } from "systems/map-generation/MapGenerator2";
import { CavernNoiseProvider } from "systems/map-generation/providers/CavernNoiseProvider";
import { HeightNoiseProvider } from "systems/map-generation/providers/HeightNoise";
import { MoistureNoiseProvider } from "systems/map-generation/providers/MoistureNoise";
import { TreeNoiseProvider } from "systems/map-generation/providers/TreeNoise";
import { CustomMinimap } from "systems/minimap/CustomMinimap";
import { Minimap } from "systems/minimap/Minimap";
import { Random } from "systems/random/Random";
import { ResourceDropManager } from "systems/resource-drops/ResourceDropManager";
import { ToolManager } from "systems/tools/ToolManager";
import { ErrorService } from "systems/ui/ErrorService";
import { CameraSetup, MapPlayer, Rectangle, Timer, Trigger, Unit } from "w3ts/index";

export function Initialize() {

    const config = new Config();

    // Abilities
    const abilityEvent = new AbilityEventHandler();
    const abilityEventProvider = new AbilityEventProvider(abilityEvent);
    const basicSlotManager = new AbilitySlotManager();
    const specialSlotManager = new AbilitySlotManager();
    const errorService = new ErrorService();

    const pathingService = new PathingService('hval');

    Log.Level = Level.All;

    // const seed = 5;
    const seed = 6;
    const random = new Random(seed);
    
    // mapGenerator.resume();
    FogModifierStart(CreateFogModifierRect(Player(0), FOG_OF_WAR_VISIBLE, GetPlayableMapRect(), true, true));
    
    const tim1 = new Timer();
    tim1.start(0, false, () => {

        const surfaceRect = Rectangle.fromHandle(gg_rct_TestSurface);
        const undergroundRect = Rectangle.fromHandle(gg_rct_TestUnderground);
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

        // Resources
        let resourceDropManager = new ResourceDropManager();

        const heightNoise = new HeightNoiseProvider(random);
        const minimap = new CustomMinimap(surfaceRect);
        const treeNoise = new TreeNoiseProvider(random);
        const moistureNoise = new MoistureNoiseProvider(random);
        const cavernNoise = new CavernNoiseProvider(random);
        const mapGenerator = new MapGenerator2(minimap, heightNoise, treeNoise, moistureNoise, cavernNoise, resourceDropManager, surfaceRect, undergroundRect, random);
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
            let x = GetSpellTargetX();
            let y = GetSpellTargetY();
            let pathingName = '';
            switch (mapGenerator.pathingBuilder.getPathing(x, y)) {
                case PathingType.HillSteepUnwalkable: pathingName = 'HillSteepUnwalkable'; break;
                case PathingType.DeepWater: pathingName = 'DeepWater'; break;
                case PathingType.Hills: pathingName = 'Hills'; break;
                case PathingType.Plains: pathingName = 'Plains'; break;
                case PathingType.ShallowWater: pathingName = 'ShallowWater'; break;
                case PathingType.SteepShore: pathingName = 'SteepShore'; break;
            }
            Log.Info("Terrain height:", mapGenerator.heightBuilder.getHeight(x, y), pathingName);
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

    const mapArea = Rectangle.getWorldBounds();
    
    // abilities.ProspectorSpellbook.AddToUnit(u);
    // p.setAbilityAvailable(abilities.Defile.extId as number, false);
    // p.setAbilityAvailable(abilities.EyeOfKilrogg.extId as number, false);
    // p.setAbilityAvailable(abilities.InfuseFelstone.extId as number, false);

    // abilities.Defile.AddToUnit(u, true);
    // abilities.EyeOfKilrogg.AddToUnit(u, true);
    // abilities.InfuseFelstone.AddToUnit(u, true);
    
    let onGameStartTimer = new Timer();
    onGameStartTimer.start(0, false, () => {

        const toolManager = new ToolManager('AT0Z', { x: mapArea.maxX, y: mapArea.minY });
        const craftingManager = new CraftingManager();

        // Materials
        craftingManager.RegisterItemMaterial(FourCC('IMS1'), Material.Stone | Material.TierI);
        craftingManager.RegisterItemMaterial(FourCC('IMS2'), Material.Stone | Material.TierII);
        craftingManager.RegisterItemMaterial(FourCC('IMS3'), Material.Stone | Material.TierIII);

        craftingManager.RegisterItemMaterial(FourCC('IMW1'), Material.Wood | Material.TierI);
        craftingManager.RegisterItemMaterial(FourCC('IMW2'), Material.Wood | Material.TierII);
        // craftingManager.RegisterItemMaterial(FourCC('IMW3'), Material.Wood | Material.TierIII);

        craftingManager.RegisterItemMaterial(ResourceItem.Iron, Material.Metal | Material.TierI);
        // craftingManager.RegisterItemMaterial(FourCC('IMW2'), Material.Wood | Material.TierII);

        let prospectorQ = new BasicAbility(config.ProspectorSpellbook);
        let artisanQ = new BasicAbility(config.ArtisanSpellbook);
        let abilities = {

            // Prospector
            ProspectorSpellbook: prospectorQ,
            Defile: new Defile(config.Defile, abilityEvent, errorService),
            EyeOfKilrogg: new BasicAbility(config.EyeOfKilrogg),
            InfuseFelstone: new BasicAbility(config.InfuseFelstone),
            CrystalizeFel: new BasicAbility(config.CrystalizeFel),
            Demonfruit: new BasicAbility(config.Demonfruit),
            TransferFel: new BasicAbility(config.TransferFel),
            PrepareFelCollector: new BasicAbility(config.PrepareFelCollector),

            // Artisan
            ArtisanSpellbook: artisanQ,
            Transmute: new BasicAbility(config.Transmute),
            TransmuteRock: new Transmute(config.TransmuteRock, abilityEvent, craftingManager, errorService, ResourceItem.Rock),
            TransmuteIron: new Transmute(config.TransmuteIron, abilityEvent, craftingManager, errorService, ResourceItem.Iron),
            CrudeAxe: new CrudeAxe(config.CrudeAxe, abilityEvent, craftingManager, errorService),
            CrudePickaxe: new CrudePickaxe(config.CrudePickaxe, abilityEvent, craftingManager, errorService),
            Workstation: new Workstation(config.Workstation, artisanQ, abilityEvent, basicSlotManager, craftingManager, errorService),
            HellForge: new BasicAbility(config.HellForge),
            Transmuter: new BasicAbility(config.Transmuter),

            // Tool Abilities
            Axe: new Axe(config.Axe, abilityEvent),
            Pickaxe: new Pickaxe(config.Pickaxe, abilityEvent),
        }

        // Tools
        toolManager.RegisterTool('IT00', abilities.Axe, 1);
        toolManager.RegisterTool('IT02', abilities.Axe, 2);
        toolManager.RegisterTool('IT01', abilities.Pickaxe, 1);
        toolManager.RegisterTool('IT03', abilities.Pickaxe, 2);

        // Machines
        const workstation = new WorkstationMachine(FourCC('h000'), errorService, craftingManager);

        // // Make players
        // let startPoint = { x: 0, y: 0 };
        // SetPlayerAlliance(Player(15), Player(0), ALLIANCE_SHARED_CONTROL, true);
        // SetPlayerAllianceStateBJ(Player(0), Player(15), bj_ALLIANCE_ALLIED);
        // let u = new Unit(MapPlayer.fromIndex(15), FourCC('e000'), startPoint.x, startPoint.y, 270);

        let p = MapPlayer.fromIndex(0);
        let u = Unit.fromHandle(gg_unit_Hblm_0003);
        let pc = new Artisan(u, abilities, basicSlotManager, specialSlotManager);
    
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