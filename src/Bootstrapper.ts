import { InitCommands } from "commands/AllCommands";
import { Config, Global, sharedPlayer } from "config/Config";
import { CrudeAxe } from "content/abilities/artisan/CrudeAxe";
import { CrudePickaxe } from "content/abilities/artisan/CrudePickaxe";
import { HellForge } from "content/abilities/artisan/HellForge";
import { Minecart } from "content/abilities/artisan/Minecart";
import { Mineshaft } from "content/abilities/artisan/Mineshaft";
import { Transmute } from "content/abilities/artisan/Transmute";
import { Transmuter } from "content/abilities/artisan/Transmuter";
import { Workstation } from "content/abilities/artisan/Workstation";
import { ForgeFlames } from "content/abilities/machines/ForgeFlames";
import { CrystalizeFel } from "content/abilities/prospector/CrystalizeFel";
import { Defile } from "content/abilities/prospector/Defile";
import { Axe } from "content/abilities/tools/Axe";
import { Hand } from "content/abilities/tools/Hand";
import { Pickaxe } from "content/abilities/tools/Pickaxe";
import { TransferInventory } from "content/abilities/tools/TransferInventory";
import { HeroManager } from "content/gameplay/HeroManager";
import { ResourceItem } from "content/items/ResourceItem";
import { MachineFactory } from "content/machines/MachineFactory";
import { Level, Log } from "Log";
import { PathingService } from "services/PathingService";
import { BasicAbility } from "systems/abilities/BasicAbility";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { MachineManager } from "systems/crafting/machine/MachineManager";
import { AbilityEventHandler } from "systems/events/ability-events/AbilityEventHandler";
import { AbilityEventProvider } from "systems/events/ability-events/AbilityEventProvider";
import { DimensionEventHandler } from "systems/events/dimension-events/DimensionEventHandler";
import { DimensionEventProvider } from "systems/events/dimension-events/DimensionEventProvider";
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
import { ToolManager } from "systems/tools/ToolManager";
import { ErrorService } from "systems/ui/ErrorService";
import { MapPlayer, Quest, Rectangle, Timer, Trigger, Unit } from "w3ts/index";

export function Initialize() {

    const config = new Config();

    // Set Player alliances

    Log.Level = Level.Message;
    let generateMap = true;

    for (let p of config.players) {
        SetPlayerAllianceStateBJ(p.handle, sharedPlayer.handle, bj_ALLIANCE_ALLIED_UNITS);
        SetPlayerAllianceStateBJ(sharedPlayer.handle, p.handle, bj_ALLIANCE_ALLIED_ADVUNITS);

        // p.setAlliance(sharedPlayer, ALLIANCE_PASSIVE, true);
        // p.setAlliance(sharedPlayer, ALLIANCE_HELP_REQUEST, true);
        // p.setAlliance(sharedPlayer, ALLIANCE_HELP_RESPONSE, true);
        // p.setAlliance(sharedPlayer, ALLIANCE_SHARED_XP, true);
        // p.setAlliance(sharedPlayer, ALLIANCE_SHARED_SPELLS, true);
        // p.setAlliance(sharedPlayer, ALLIANCE_SHARED_CONTROL, true);
        // p.setAlliance(sharedPlayer, ALLIANCE_SHARED_ADVANCED_CONTROL, true);

        // sharedPlayer.setAlliance(p, ALLIANCE_PASSIVE, true);
        // sharedPlayer.setAlliance(p, ALLIANCE_HELP_REQUEST, true);
        // sharedPlayer.setAlliance(p, ALLIANCE_HELP_RESPONSE, true);
        // sharedPlayer.setAlliance(p, ALLIANCE_SHARED_XP, true);
        // sharedPlayer.setAlliance(p, ALLIANCE_SHARED_SPELLS, true);
        // sharedPlayer.setAlliance(p, ALLIANCE_SHARED_CONTROL, true);
        // sharedPlayer.setAlliance(p, ALLIANCE_SHARED_ADVANCED_CONTROL, true);

        p.setState(PLAYER_STATE_RESOURCE_FOOD_CAP, 1);
    }

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
    const dimensionEvent = new DimensionEventHandler();
    const errorService = new ErrorService();

    const pathingService = new PathingService('hval');

    // const seed = 5;
    const seed = math.floor(math.random(0, 100));
    const random = new Random(seed);

    let surfaceRect: Rectangle;
    let undergroundRect: Rectangle;

    let choice = 2;
    if (choice == 1) {
            surfaceRect = Rectangle.fromHandle(gg_rct_SurfaceMap);
            undergroundRect = Rectangle.fromHandle(gg_rct_UndergroundMap);
    } else if (choice == 2) {
            surfaceRect = Rectangle.fromHandle(gg_rct_Surface2);
            undergroundRect = Rectangle.fromHandle(gg_rct_Underground2);
    } else {
        surfaceRect = Rectangle.fromHandle(gg_rct_TestSurface);
        undergroundRect = Rectangle.fromHandle(gg_rct_TestUnderground);
    }

    const dimensionEventProvider = new DimensionEventProvider(dimensionEvent, surfaceRect, undergroundRect);
    const craftingManager = new CraftingManager();
    const itemFactory = new ItemFactory(config.items, craftingManager);

    dimensionEvent.OnSurfaceEvent((e) => {
        if (e.unit.isHero() && e.unit.owner.handle == GetLocalPlayer()) {
            SetCameraBoundsToRect(surfaceRect.handle);
            PanCameraToTimed(e.unit.x, e.unit.y, 0);
            SelectUnitSingle(e.unit.handle);
        }
    });

    dimensionEvent.OnUndergroundEvent((e) => {
        if (e.unit.isHero() && e.unit.owner.handle == GetLocalPlayer()) {
            SetCameraBoundsToRect(undergroundRect.handle);
            PanCameraToTimed(e.unit.x, e.unit.y, 0);
            SelectUnitSingle(e.unit.handle);
        }
    });

    // Make players
    // FogModifierStart(CreateFogModifierRect(Player(0), FOG_OF_WAR_VISIBLE, GetPlayableMapRect(), true, true));
    Global.soulAnchor = new Unit(sharedPlayer, FourCC('e000'), surfaceRect.centerX, surfaceRect.centerY, 0);
    PanCameraToTimed(Global.soulAnchor.x, Global.soulAnchor.y, 0);
    SelectUnitSingle(Global.soulAnchor.handle);
    SetCameraField(CAMERA_FIELD_TARGET_DISTANCE, 150, 0);
    SetCameraBoundsToRect(surfaceRect.handle);

    // let startPoint = { x: 0, y: 0 };

    // let p = MapPlayer.fromIndex(0);
    // let u = Unit.fromHandle(gg_unit_Hblm_0003);
    // let pc = new Artisan(u, abilities, basicSlotManager, specialSlotManager, toolManager);

    const tim = new Timer()

        tim.start(0, false, () => {

            for (let q of config.quests) {
                let quest = new Quest();
                quest.setTitle(q.title);
                quest.setIcon(q.icon);
                quest.setDescription(q.description);
            }
        
            const heightNoise = new HeightNoiseProvider(random);
            const surfaceMinimap = new CustomMinimap(surfaceRect);
            const treeNoise = new TreeNoiseProvider(random);
            const moistureNoise = new MoistureNoiseProvider(random);
            const cavernNoise = new CavernNoiseProvider(random);
            const mapGenerator = new MapGenerator2(surfaceMinimap, heightNoise, treeNoise, moistureNoise, cavernNoise, surfaceRect, undergroundRect, itemFactory, random);
            
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
            if (generateMap == false) {
                mapGenerator.isDone = true;
            }

            tim.pause();
            tim.start(0.02, true, () => {
                if (mapGenerator.isDone) {
                    tim.destroy();
                    progressTim.destroy();
                    time = os.clock() - time;
    
                    Log.Message("Finished generating in ", time);
                    SetCameraField(CAMERA_FIELD_TARGET_DISTANCE, 2000, 0.5);
                    PanCameraToTimed(Global.soulAnchor.x, Global.soulAnchor.y, 0);
                        
                } else
                    mapGenerator.resume();
            });
            const progressTim = new Timer();
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

    const toolManager = new ToolManager('AT0Z', { x: mapArea.maxX, y: mapArea.minY });
    const machineManager = new MachineManager(abilityEvent);
    const machineFactory = new MachineFactory(config, craftingManager, itemFactory, errorService);
    const inputHandler = new InputHandler(config.players);

    // Materials
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

    // Order of abilities defined affects their order in the spellbooks!!!
    let abilities = {

        // Prospector
        ProspectorSpellbook: prospectorQ,
        Defile: new Defile(config.Defile, abilityEvent, errorService),
        InfuseFelstone: new BasicAbility(config.InfuseFelstone),
        Demonfruit: new BasicAbility(config.Demonfruit),
        PrepareFelCollector: new BasicAbility(config.PrepareFelCollector),
        CrystalizeFel: new CrystalizeFel(config.CrystalizeFel, abilityEvent, errorService, itemFactory),
        EyeOfKilrogg: new BasicAbility(config.EyeOfKilrogg),
        TransferFel: new BasicAbility(config.TransferFel),

        // Artisan
        ArtisanSpellbook: artisanQ,
        Transmute: new BasicAbility(config.Transmute),
        TransmuteRock: new Transmute(config.TransmuteRock, abilityEvent, craftingManager, errorService, ResourceItem.Rock),
        TransmuteIron: new Transmute(config.TransmuteIron, abilityEvent, craftingManager, errorService, ResourceItem.Iron),
        TransmuteCopper: new Transmute(config.TransmuteCopper, abilityEvent, craftingManager, errorService, ResourceItem.Copper),
        CrudeAxe: new CrudeAxe(config.CrudeAxe, abilityEvent, craftingManager, errorService),
        CrudePickaxe: new CrudePickaxe(config.CrudePickaxe, abilityEvent, craftingManager, errorService),
        HellForge: new HellForge(config.HellForge, artisanQ, abilityEvent, basicSlotManager, craftingManager, errorService, machineFactory, machineManager),
        Workstation: new Workstation(config.Workstation, artisanQ, abilityEvent, basicSlotManager, craftingManager, errorService, machineFactory, machineManager),
        Transmuter: new Transmuter(config.Transmuter, artisanQ, abilityEvent, basicSlotManager, craftingManager, errorService, machineFactory, machineManager),
        Minecart: new Minecart(config.Minecart, artisanQ, abilityEvent, basicSlotManager, errorService, craftingManager, dimensionEvent),
        Mineshaft: new Mineshaft(config.Mineshaft, artisanQ, surfaceRect, undergroundRect, abilityEvent, basicSlotManager, errorService, craftingManager, dimensionEvent),

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
        ForgeFlames: new ForgeFlames(config.ForgeFlames, abilityEvent),
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
    
    InitCommands(config, inputHandler, basicSlotManager, specialSlotManager);
    
    // const tim1 = new Timer();
    // tim1.start(0, false, () => {
    // });
    
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
}