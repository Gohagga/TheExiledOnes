import { Config, SharedPlayer } from "Config";
import { CrudeAxe } from "content/abilities/artisan/CrudeAxe";
import { CrudePickaxe } from "content/abilities/artisan/CrudePickaxe";
import { Transmute } from "content/abilities/artisan/Transmute";
import { Workstation } from "content/abilities/artisan/Workstation";
import { Defile } from "content/abilities/prospector/Defile";
import { Axe } from "content/abilities/tools/Axe";
import { Hand } from "content/abilities/tools/Hand";
import { Pickaxe } from "content/abilities/tools/Pickaxe";
import { TransferInventory } from "content/abilities/tools/TransferInventory";
import { Artisan } from "content/classes/Artisan";
import { HeroManager } from "content/gameplay/HeroManager";
import { ResourceItem } from "content/items/ResourceItem";
import { MachineFactory } from "content/machines/MachineFactory";
import { Level, Log } from "Log";
import { PathingService } from "services/PathingService";
import { BasicAbility } from "systems/abilities/BasicAbility";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { MachineManager } from "systems/crafting/machine/MachineManager";
import { Material } from "systems/crafting/Material";
import { AbilityEventHandler } from "systems/events/ability-events/AbilityEventHandler";
import { AbilityEventProvider } from "systems/events/ability-events/AbilityEventProvider";
import { InputHandler } from "systems/events/input-events/InputHandler";
import { ItemFactory } from "systems/items/ItemFactory";
import { PathingType } from "systems/map-generation/builders/PathingBuilder";
import { MapGenerator2 } from "systems/map-generation/MapGenerator2";
import { CavernNoiseProvider } from "systems/map-generation/providers/CavernNoiseProvider";
import { HeightNoiseProvider } from "systems/map-generation/providers/HeightNoise";
import { MoistureNoiseProvider } from "systems/map-generation/providers/MoistureNoise";
import { TreeNoiseProvider } from "systems/map-generation/providers/TreeNoise";
import { CustomMinimap } from "systems/minimap/CustomMinimap";
import { Random } from "systems/random/Random";
import { ResourceDropManager } from "systems/resource-drops/ResourceDropManager";
import { ToolManager } from "systems/tools/ToolManager";
import { ErrorService } from "systems/ui/ErrorService";
import { MapPlayer, Rectangle, Timer, Trigger, Unit } from "w3ts/index";

export function Initialize() {

    const config = new Config();

    // Set Player alliances

    Log.Level = Level.All;

    let p = MapPlayer.fromIndex(0);
    p.setAlliance(SharedPlayer, ALLIANCE_PASSIVE, true);
    p.setAlliance(SharedPlayer, ALLIANCE_HELP_REQUEST, true);
    p.setAlliance(SharedPlayer, ALLIANCE_HELP_RESPONSE, true);
    p.setAlliance(SharedPlayer, ALLIANCE_SHARED_XP, true);
    p.setAlliance(SharedPlayer, ALLIANCE_SHARED_SPELLS, true);
    // p.setAlliance(SharedPlayer, ALLIANCE_SHARED_CONTROL, true);
    p.setAlliance(SharedPlayer, ALLIANCE_SHARED_ADVANCED_CONTROL, true);

    SharedPlayer.setAlliance(p, ALLIANCE_PASSIVE, true);
    SharedPlayer.setAlliance(p, ALLIANCE_HELP_REQUEST, true);
    SharedPlayer.setAlliance(p, ALLIANCE_HELP_RESPONSE, true);
    SharedPlayer.setAlliance(p, ALLIANCE_SHARED_XP, true);
    SharedPlayer.setAlliance(p, ALLIANCE_SHARED_SPELLS, true);
    // SharedPlayer.setAlliance(p, ALLIANCE_SHARED_CONTROL, true);
    SharedPlayer.setAlliance(p, ALLIANCE_SHARED_ADVANCED_CONTROL, true);

    p.setState(PLAYER_STATE_RESOURCE_FOOD_CAP, 1);

    // SetPlayerAllianceStateBJ(Player(0), SharedPlayer.handle, bj_ALLIANCE_ALLIED_UNITS);
    // SetPlayerAllianceStateBJ(SharedPlayer.handle, Player(0), bj_ALLIANCE_ALLIED_ADVUNITS);
    // SharedPlayer.setAlliance(MapPlayer.fromIndex(0), ALLIANCE_SHARED_SPELLS, true);
    // SharedPlayer.setAlliance(MapPlayer.fromIndex(0), ALLIANCE_SHARED_CONTROL, true);
    // SetPlayerAlliance(Player(0), SharedPlayer.handle, ALLIANCE_SHARED_CONTROL, true);

    MultiboardSuppressDisplay(true);
    ClearTextMessages();

    // Abilities
    const abilityEvent = new AbilityEventHandler();
    const abilityEventProvider = new AbilityEventProvider(abilityEvent);
    const basicSlotManager = new AbilitySlotManager();
    const specialSlotManager = new AbilitySlotManager();
    const errorService = new ErrorService();

    const pathingService = new PathingService('hval');

    // const seed = 5;
    const seed = math.floor(math.random(0, 100));
    const random = new Random(seed);

    const tim1 = new Timer();
    tim1.start(0, false, () => {

        const surfaceRect = Rectangle.fromHandle(gg_rct_SurfaceMap);
        const undergroundRect = Rectangle.fromHandle(gg_rct_UndergroundMap);

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

        // Make players
        // FogModifierStart(CreateFogModifierRect(Player(0), FOG_OF_WAR_VISIBLE, GetPlayableMapRect(), true, true));
        let soulAnchor = new Unit(SharedPlayer, FourCC('e000'), surfaceRect.centerX, surfaceRect.centerY, 0);
        PanCameraToTimedWithZ(soulAnchor.x, soulAnchor.y, 100, 0);
        SetCameraBoundsToRect(gg_rct_SurfaceMap);

        // let startPoint = { x: 0, y: 0 };

        // let p = MapPlayer.fromIndex(0);
        // let u = Unit.fromHandle(gg_unit_Hblm_0003);
        // let pc = new Artisan(u, abilities, basicSlotManager, specialSlotManager, toolManager);

        const tim = new Timer()
        const progressTim = new Timer();
        tim.start(0.02, true, () => {
            if (mapGenerator.isDone) {
                tim.destroy();
                progressTim.destroy();
                time = os.clock() - time;

                Log.Message("Finished generating in ", time);
                    
            } else
                mapGenerator.resume();
        });
        progressTim.start(1, true, () => {
            ClearTextMessages();
            let passed = math.floor(os.clock() - time + 0.5);
            let prediction = passed / mapGenerator.progress;
            Log.Message("Progress: ", math.floor(mapGenerator.progress * 100 + 0.5) + '%', "seconds passed: ", passed, "prediction: ", prediction);
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
        const itemFactory = new ItemFactory(config.items, craftingManager);
        const machineManager = new MachineManager(abilityEvent);
        const machineFactory = new MachineFactory(config, craftingManager, itemFactory, errorService);
        const inputHandler = new InputHandler(config.players);

        // Materials
        itemFactory.RegisterResource(ResourceItem.Rock, Material.Stone | Material.TierI);
        itemFactory.RegisterResource(ResourceItem.Stone, Material.Stone | Material.TierII);
        itemFactory.RegisterResource(ResourceItem.Felstone, Material.Stone | Material.TierIII);

        itemFactory.RegisterResource(ResourceItem.Branch, Material.Wood | Material.TierI);
        itemFactory.RegisterResource(ResourceItem.Log, Material.Wood | Material.TierII);
        // itemFactory.RegisterResource(FourCC('IMW3'), Material.Wood | Material.TierIII);

        itemFactory.RegisterResource(ResourceItem.Iron, Material.Metal | Material.TierI);
        itemFactory.RegisterResource(ResourceItem.Steel, Material.Metal | Material.TierII);
        itemFactory.RegisterResource(ResourceItem.FelSteel, Material.Metal | Material.TierIII);

        itemFactory.RegisterResource(ResourceItem.Copper, Material.FineMetal | Material.TierI);
        itemFactory.RegisterResource(ResourceItem.Silver, Material.FineMetal | Material.TierII);
        itemFactory.RegisterResource(ResourceItem.Gold, Material.FineMetal | Material.TierIII);

        // Material parts
        // craftingManager.RegisterItemMaterial(ComponentItem.MechanismI, Material.Mechanism | Material.TierI);
        // craftingManager.RegisterItemMaterial(ComponentItem.MechanismII, Material.Mechanism | Material.TierII);
        // craftingManager.RegisterItemMaterial(ComponentItem.MechanismIII, Material.Mechanism | Material.TierIII);
        // craftingManager.RegisterItemMaterial(ComponentItem.MechanismIV, Material.Mechanism | Material.TierIII);

        // craftingManager.RegisterItemMaterial(ComponentItem.FrameI, Material.Frame | Material.TierI);
        // craftingManager.RegisterItemMaterial(ComponentItem.FrameII, Material.Frame | Material.TierII);
        // craftingManager.RegisterItemMaterial(ComponentItem.FrameIII, Material.Frame | Material.TierIII);
        // craftingManager.RegisterItemMaterial(ComponentItem.FrameIV, Material.Frame | Material.TierIII);

        let prospectorQ = new BasicAbility(config.ProspectorSpellbook);
        let artisanQ = new BasicAbility(config.ArtisanSpellbook);
        let researcherQ = new BasicAbility(config.ResearcherSpellbook);
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
            TransmuteCopper: new Transmute(config.TransmuteCopper, abilityEvent, craftingManager, errorService, ResourceItem.Copper),
            CrudeAxe: new CrudeAxe(config.CrudeAxe, abilityEvent, craftingManager, errorService),
            CrudePickaxe: new CrudePickaxe(config.CrudePickaxe, abilityEvent, craftingManager, errorService),
            Workstation: new Workstation(config.Workstation, artisanQ, abilityEvent, basicSlotManager, craftingManager, errorService, machineFactory, machineManager),
            HellForge: new BasicAbility(config.HellForge),
            Transmuter: new BasicAbility(config.Transmuter),

            // Researcher
            ResearcherSpellbook: artisanQ,
            // Transmute: new BasicAbility(config.Transmute),
            // TransmuteRock: new Transmute(config.TransmuteRock, abilityEvent, craftingManager, errorService, ResourceItem.Rock),
            // TransmuteIron: new Transmute(config.TransmuteIron, abilityEvent, craftingManager, errorService, ResourceItem.Iron),
            // CrudeAxe: new CrudeAxe(config.CrudeAxe, abilityEvent, craftingManager, errorService),
            // CrudePickaxe: new CrudePickaxe(config.CrudePickaxe, abilityEvent, craftingManager, errorService),
            // Workstation: new Workstation(config.Workstation, artisanQ, abilityEvent, basicSlotManager, craftingManager, errorService, machineFactory, machineManager),
            // HellForge: new BasicAbility(config.HellForge),
            // Transmuter: new BasicAbility(config.Transmuter),

            // Tool Abilities
            Hand: new Hand(config.Hand, abilityEvent, inputHandler, toolManager, itemFactory),
            Axe: new Axe(config.Axe, abilityEvent),
            Pickaxe: new Pickaxe(config.Pickaxe, abilityEvent),
            TransferItems: new TransferInventory(config.TransferInventory, abilityEvent),
        }

        // Tools
        toolManager.RegisterTool('IT00', abilities.Axe, 1);
        toolManager.RegisterTool('IT02', abilities.Axe, 2);
        toolManager.RegisterTool('IT01', abilities.Pickaxe, 1);
        toolManager.RegisterTool('IT03', abilities.Pickaxe, 2);

        // Machines
        // const workstation = new WorkstationMachine(config.WorkstationMachine, Unit.fromHandle(gg_unit_h000_0016), errorService, craftingManager, itemFactory);
        const heroManager = new HeroManager(config.heroes, abilities, basicSlotManager, specialSlotManager, toolManager);

        let cam = new Trigger();
        cam.registerPlayerChatEvent(MapPlayer.fromLocal(), '-cam', false);
        cam.addAction(() => {
            print("EVENT");
            let str = GetEventPlayerChatString();
            let number: number = 3000;
            let ind = 0;
            if (str.startsWith('-cam '))
                ind = 4;
            else if (str == '-cam') {
                number = 3000;
            } else if (str.startsWith('-zoom ')) {
                ind = 5;
            } else {
                return;
            }

            print("Camera distance set to ", number);
            SetCameraFieldForPlayer(MapPlayer.fromEvent().handle, CAMERA_FIELD_TARGET_DISTANCE, number, 0.5);
            SetCameraFieldForPlayer(MapPlayer.fromEvent().handle, CAMERA_FIELD_FARZ, 100000, 0.5);
        });
        // SetCameraFieldForPlayer(MapPlayer.fromIndex(0).handle, CAMERA_FIELD_FARZ, 100000, 0.5);

        // let time = 0;
        // new Timer().start(1, true, () => {
            
        //     time++;
        //     let hours = time / 3600;
        //     let minutes = (time % 3600) / 60;
        //     let seconds = (time % 60);
        //     print(string.format('%02.0f:%02.0f:%02.0f', hours, minutes, seconds)); // 02:05:01
        //     print(string.format('%2.0f:%02.0f:%02.0f', hours, minutes, seconds)); // 2:05:01
        // });
    });
    onGameStartTimer.destroy();
}