import { InitCommands } from "commands/AllCommands";
import { Config, enemyPlayer, Global, sharedPlayer } from "config/Config";
import { CrudeAxe } from "content/abilities/artisan/CrudeAxe";
import { CrudePickaxe } from "content/abilities/artisan/CrudePickaxe";
import { HellForge } from "content/abilities/artisan/HellForge";
import { Minecart } from "content/abilities/artisan/Minecart";
import { Mineshaft } from "content/abilities/artisan/Mineshaft";
import { Transmute } from "content/abilities/artisan/Transmute";
import { Transmuter } from "content/abilities/artisan/Transmuter";
import { Workstation } from "content/abilities/artisan/Workstation";
import { ForgeRaiseTemperature } from "content/abilities/machines/ForgeRaiseTemperature";
import { CrystalizeFel } from "content/abilities/prospector/CrystalizeFel";
import { Defile } from "content/abilities/prospector/Defile";
import { Axe } from "content/abilities/tools/Axe";
import { Hand } from "content/abilities/tools/Hand";
import { Pickaxe } from "content/abilities/tools/Pickaxe";
import { TransferInventory } from "content/abilities/tools/TransferInventory";
import { HeroManager } from "content/gameplay/HeroManager";
import { Animal, ComponentItem, ResourceItem } from "content/items/ResourceItem";
import { MachineFactory } from "content/machines/MachineFactory";
import { Level, Log } from "Log";
import { PathingService } from "services/PathingService";
import { BasicAbility } from "systems/abilities/BasicAbility";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { ForgeManager } from "systems/crafting/ForgeManager";
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
import { EnumUnitService } from "services/enum-service/EnumUnitService";
import { ToolManager } from "systems/tools/ToolManager";
import { ErrorService } from "systems/ui/ErrorService";
import { Color, Frame, MapPlayer, Quest as Wc3Quest, Rectangle, Timer, Trigger, Unit } from "w3ts/index";
import { FelSmithing } from "content/abilities/artisan/FelSmithing";
import { Tools } from "content/items/Tools";
import { Equipment } from "content/items/Equipment";
import { ForgeMaintainTemperature } from "content/abilities/machines/ForgeMaintainTemperature";
import { FelBasin } from "content/abilities/prospector/FelBasin";
import { Depot } from "content/abilities/researcher/Depot";
import { Automaton } from "content/abilities/researcher/Automaton";
import { NetEnsnare } from "content/abilities/tools/NetEnsnare";
import { FelInjector } from "content/abilities/researcher/FelInjector";
import { Obliterum } from "content/abilities/researcher/Obliterum";
import { ExperimentChamber } from "content/abilities/researcher/ExperimentChamber";
import { CustomMinimap2 } from "systems/minimap/CustomMinimap2";
import { Research } from "content/abilities/researcher/ResearchAbility";
import { Study } from "content/abilities/researcher/Study";
import { Demonfruit } from "content/abilities/prospector/Demonfruit";
import { FelExtraction } from "content/abilities/prospector/FelExtraction";
import { OrganicMatter } from "content/abilities/researcher/OrganicMatter";
import { EssenceOfBlight } from "content/abilities/sold-abilities/EssenceOfBlight";
import { CreateQuestView } from "ui/quest-view/QuestView";
import { QuestManager } from "systems/quests/QuestManager";
import { QuestEventHandler } from "systems/events/quests/QuestEventHandler";
import { Quest } from "systems/quests/Quest";
import { QuestViewModel } from "ui/quest-view/QuestViewModel";
import { ItemQuest } from "systems/quests/ItemQuest";
import { Material } from "systems/crafting/Material";
import { AbilityUsedQuest } from "systems/quests/AbilityUsedQuest";
import { BuildingQuest } from "systems/quests/BuildingQuest";
import { ResearchQuest } from "systems/quests/ResearchQuest";
import { DimensionalGate } from "content/abilities/DimensionalGate";
import { AiController } from "content/ai/AiController";
import { EnemyGenerator } from "systems/map-generation/object-placers/EnemyGenerator";

export function InitializeRework() {

    const config = new Config();

    Log.Level = Level.All;
    // Log.Level = Level.Message;
    Log.Level = Level.Error;
    let generateMap = true;
    let lockToSurface = false;
    FogModifierStart(CreateFogModifierRect(Player(0), FOG_OF_WAR_VISIBLE, GetPlayableMapRect(), true, true));
    
    SetPlayerAllianceStateBJ(enemyPlayer.handle, sharedPlayer.handle, bj_ALLIANCE_UNALLIED);
    SetPlayerAllianceStateBJ(sharedPlayer.handle, enemyPlayer.handle, bj_ALLIANCE_UNALLIED);

    // Set Player alliances
    let alliedPlayers: MapPlayer[] = [...config.players, sharedPlayer];
    for (let p of config.players) {
        SetPlayerAllianceStateBJ(p.handle, sharedPlayer.handle, bj_ALLIANCE_ALLIED_UNITS);
        SetPlayerAllianceStateBJ(sharedPlayer.handle, p.handle, bj_ALLIANCE_ALLIED_ADVUNITS);
        p.setState(PLAYER_STATE_RESOURCE_FOOD_CAP, 1);
    }

    MultiboardSuppressDisplay(true);
    ClearTextMessages();

    // Abilities
    const abilityEvent = new AbilityEventHandler();
    const abilityEventProvider = new AbilityEventProvider(abilityEvent);
    const basicSlotManager = new AbilitySlotManager();
    const specialSlotManager = new AbilitySlotManager();
    const dimensionEvent = new DimensionEventHandler();
    const errorService = new ErrorService();
    const enumService = new EnumUnitService();
    const questEvent = new QuestEventHandler();

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

    const mapArea = Rectangle.getWorldBounds();

    // Make players
    Global.soulAnchor = new Unit(sharedPlayer, FourCC('E000'), mapArea.minY, mapArea.minY, 0);
    PanCameraToTimed(Global.soulAnchor.x, Global.soulAnchor.y, 0);
    SelectUnitSingle(Global.soulAnchor.handle);
    SetCameraField(CAMERA_FIELD_TARGET_DISTANCE, 150, 0);
    if (lockToSurface) SetCameraBoundsToRect(surfaceRect.handle);

    const tim = new Timer()

    tim.start(0, false, () => {

    for (let q of config.quests) {
        let quest = new Wc3Quest();
        quest.setTitle(q.title);
        quest.setIcon(q.icon);
        quest.setDescription(q.description);
    }

    const heightNoise = new HeightNoiseProvider(random);
    const surfaceMinimap = new CustomMinimap2(surfaceRect);
    const treeNoise = new TreeNoiseProvider(random);
    const moistureNoise = new MoistureNoiseProvider(random);
    const cavernNoise = new CavernNoiseProvider(random);

    const enemyGen = new EnemyGenerator(enumService);
    const mapGenerator = new MapGenerator2(
        surfaceMinimap,
        heightNoise,
        treeNoise,
        moistureNoise,
        cavernNoise,
        surfaceRect,
        undergroundRect,
        itemFactory,
        enumService,
        enemyGen,
        random);
    
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

    let soulAnchorPlaced = false;
    tim.pause();
    tim.start(0.02, true, () => {
        if (mapGenerator.isDone) {
            tim.destroy();
            progressTim.destroy();
            time = os.clock() - time;
            Log.Message("Finished generating in ", time);
            
        } else {
            if (!soulAnchorPlaced && mapGenerator.progress > 0.75) {
                soulAnchorPlaced = true;
                Global.soulAnchor.setPosition(mapGenerator.startPoint.x, mapGenerator.startPoint.y);
                SetCameraField(CAMERA_FIELD_TARGET_DISTANCE, 2000, 0.5);
                PanCameraToTimed(Global.soulAnchor.x, Global.soulAnchor.y, 0);
            }
            mapGenerator.resume();
        }
    });
    const progressTim = new Timer();
    progressTim.start(1, true, () => {
        if (Log.Level != Level.All) ClearTextMessages();
        let passed = math.floor(os.clock() - time + 0.5);
        let prediction = passed / mapGenerator.progress;
        Log.Message("Progress: ", math.floor(mapGenerator.progress * 100 + 0.5) + '%', "seconds passed: ", passed, "prediction: ", prediction);
    });

    let hideItemPoint = { x: mapArea.maxX, y: mapArea.minY };

    const toolManager = new ToolManager('AT0Z', hideItemPoint);
    const machineManager = new MachineManager(abilityEvent);
    const machineFactory = new MachineFactory(config, craftingManager, itemFactory, errorService);
    const inputHandler = new InputHandler(config.players);
    const forgeManager = new ForgeManager(FourCC('A00D'), enumService);
    const heroManager = new HeroManager(config.heroes, basicSlotManager, specialSlotManager, toolManager);
    const questManager = new QuestManager(questEvent);

    let prospectorQ = new BasicAbility(config.ProspectorSpellbook, abilityEvent);
    let artisanQ = new BasicAbility(config.ArtisanSpellbook, abilityEvent);
    let researcherQ = new BasicAbility(config.ResearcherSpellbook, abilityEvent);

    let artisanW = new BasicAbility(config.ArtisanFelsmithing, abilityEvent);
    let researcherW = new BasicAbility(config.ResearchSpellbook, abilityEvent);

    let depot = new Depot(config.Depot, researcherQ, abilityEvent, basicSlotManager, errorService, craftingManager, hideItemPoint);
    let hand = new Hand(config.Hand, abilityEvent, inputHandler, toolManager, itemFactory, heroManager, errorService);
   
    // Prospector
    let aProspectorSpellbook = prospectorQ;
    let aDefile = new Defile(config.Defile, abilityEvent, errorService);
    // let aInfuseFelstone = new Transmute(config.InfuseFelstone, abilityEvent, craftingManager, itemFactory, errorService, ResourceItem.Felstone);
    let aFelExtraction = new FelExtraction(config.FelExtraction, abilityEvent, craftingManager, itemFactory, errorService);
    let aDemonfruit = new Demonfruit(config.Demonfruit, abilityEvent, craftingManager, errorService, itemFactory);
    let aFelBasin = new FelBasin(config.FelBasin, prospectorQ, abilityEvent, basicSlotManager, craftingManager, errorService);
    let aCrystalizeFel = new CrystalizeFel(config.CrystalizeFel, abilityEvent, errorService, itemFactory);
    let aEyeOfKilrogg = new BasicAbility(config.EyeOfKilrogg, abilityEvent);
    let aTransferFel = new BasicAbility(config.TransferFel, abilityEvent);

    // Artisan
    let aArtisanSpellbook = artisanQ;
    let aTransmute = new BasicAbility(config.Transmute, abilityEvent);
    let aTransmuteRock = new Transmute(config.TransmuteRock, abilityEvent, craftingManager, itemFactory, errorService, ResourceItem.Rock);
    let aTransmuteIron = new Transmute(config.TransmuteIron, abilityEvent, craftingManager, itemFactory, errorService, ResourceItem.Iron);
    let aTransmuteCopper = new Transmute(config.TransmuteCopper, abilityEvent, craftingManager, itemFactory, errorService, ResourceItem.Copper);
    let aCrudeAxe = new CrudeAxe(config.CrudeAxe, abilityEvent, craftingManager, errorService);
    let aCrudePickaxe = new CrudePickaxe(config.CrudePickaxe, abilityEvent, craftingManager, errorService);
    let aHellForge = new HellForge(config.HellForge, artisanQ, abilityEvent, basicSlotManager, craftingManager, errorService, machineFactory, machineManager);
    let aWorkstation = new Workstation(config.Workstation, artisanQ, abilityEvent, basicSlotManager, craftingManager, errorService, machineFactory, machineManager);
    let aTransmuter = new Transmuter(config.Transmuter, artisanQ, abilityEvent, basicSlotManager, craftingManager, errorService, machineFactory, machineManager);
    let aMinecart = new Minecart(config.Minecart, artisanQ, abilityEvent, basicSlotManager, errorService, craftingManager, dimensionEvent);
    let aMineshaft = new Mineshaft(config.Mineshaft, artisanQ, surfaceRect, undergroundRect, abilityEvent, basicSlotManager, errorService, craftingManager, dimensionEvent, pathingService);

    let aArtisanFelsmithing = artisanW;
    let aForgeSteel = new FelSmithing(config.ForgeSteel, abilityEvent, craftingManager, itemFactory, forgeManager, errorService, ResourceItem.Steel);
    let aForgeFelSteel = new FelSmithing(config.ForgeFelSteel, abilityEvent, craftingManager, itemFactory, forgeManager, errorService, ResourceItem.FelSteel);
    let aForgeBuildingTools = new FelSmithing(config.ForgeBuildingTools, abilityEvent, craftingManager, itemFactory, forgeManager, errorService, Tools.BuildingTools);
    let aForgeSoulGem = new FelSmithing(config.ForgeSoulGem, abilityEvent, craftingManager, itemFactory, forgeManager, errorService, Equipment.SoulGem);

    // Researcher
    let aResearcherSpellbook = researcherQ;
    let aStudy = new Study(config.Study, abilityEvent, errorService, enumService);
    let aOrganicMatter = new OrganicMatter(config.OrganicMatter, abilityEvent, craftingManager, errorService, itemFactory);
    let aNet = new Transmute(config.Net, abilityEvent, craftingManager, itemFactory, errorService, Tools.Net);
    let aExperimentChamber = new ExperimentChamber(config.ExperimentChamber, researcherQ, abilityEvent, basicSlotManager, errorService, craftingManager);
    let aAutomaton = new Automaton(config.Automaton, researcherQ, abilityEvent, basicSlotManager, errorService, craftingManager, toolManager, hand);
    let aFelInjector = new FelInjector(config.FelInjector, researcherQ, abilityEvent, basicSlotManager, errorService, craftingManager);
    let aDepot = depot;
    let aObliterum = new Obliterum(config.Obliterum, researcherQ, abilityEvent, basicSlotManager, errorService, craftingManager, machineFactory, machineManager);

    let experimentChamberId = FourCC('u002');
    let aResearchTank = new Research(config.ResearchTank, abilityEvent, craftingManager, enumService, experimentChamberId, errorService, alliedPlayers)
    let aResearchConverter = new Research(config.ResearchConverter, abilityEvent, craftingManager, enumService, experimentChamberId, errorService, alliedPlayers);
    let aResearchAutomaton = new Research(config.ResearchAutomaton, abilityEvent, craftingManager, enumService, experimentChamberId, errorService, alliedPlayers);
    let aResearchDepot = new Research(config.ResearchDepot, abilityEvent, craftingManager, enumService, experimentChamberId, errorService, alliedPlayers);

    // Sold abilities
    let aEssenceOfBlight = new EssenceOfBlight(config.EssenceOfBlight, craftingManager, errorService);

    // Other
    let aDimensionalGate = new DimensionalGate(config.DimensionalGate, abilityEvent, craftingManager, errorService, alliedPlayers);

    let abilities = {

        // Prospector
        ProspectorSpellbook: aProspectorSpellbook,
        Defile: aDefile,
        // InfuseFelstone: aInfuseFelstone,
        FelExtraction: aFelExtraction,
        Demonfruit: aDemonfruit,
        FelBasin: aFelBasin,
        CrystalizeFel: aCrystalizeFel,
        EyeOfKilrogg: aEyeOfKilrogg,
        TransferFel: aTransferFel,

        // Artisan
        ArtisanSpellbook: aArtisanSpellbook,
        Transmute: aTransmute,
        TransmuteRock: aTransmuteRock,
        TransmuteIron: aTransmuteIron,
        TransmuteCopper: aTransmuteCopper,
        CrudeAxe: aCrudeAxe,
        CrudePickaxe: aCrudePickaxe,
        HellForge: aHellForge,
        Workstation: aWorkstation,
        Transmuter: aTransmuter,
        Minecart: aMinecart,
        Mineshaft: aMineshaft,

        ArtisanFelsmithing: aArtisanFelsmithing,
        ForgeSteel: aForgeSteel,
        ForgeFelSteel: aForgeFelSteel,
        ForgeBuildingTools: aForgeBuildingTools,
        ForgeSoulGem: aForgeSoulGem,

        // Researcher
        ResearcherSpellbook: aResearcherSpellbook,
        Study: aStudy,
        OrganicMatter: aOrganicMatter,
        Net: aNet,
        ExperimentChamber: aExperimentChamber,
        Automaton: aAutomaton,
        FelInjector: aFelInjector,
        Depot: aDepot,
        Obliterum: aObliterum,

        ResearchSpellbook: researcherW,
        ResearchTank: aResearchTank,
        ResearchConverter: aResearchConverter,
        ResearchAutomaton: aResearchAutomaton,
        ResearchDepot: aResearchDepot,
        // TransmuteIron: new Transmute(config.TransmuteIron, abilityEvent, craftingManager, errorService, ResourceItem.Iron),
        // CrudeAxe: new CrudeAxe(config.CrudeAxe, abilityEvent, craftingManager, errorService),
        // CrudePickaxe: new CrudePickaxe(config.CrudePickaxe, abilityEvent, craftingManager, errorService),
        // Workstation: new Workstation(config.Workstation, artisanQ, abilityEvent, basicSlotManager, craftingManager, errorService, machineFactory, machineManager),
        // HellForge: new BasicAbility(config.HellForge),
        // Transmuter: new BasicAbility(config.Transmuter),

        // Tool Abilities
        Hand: hand,
        Axe: new Axe(config.Axe, abilityEvent, errorService),
        Pickaxe: new Pickaxe(config.Pickaxe, abilityEvent, errorService),
        TransferItems: new TransferInventory(config.TransferInventory, abilityEvent, depot),
        ForgeRaiseTemperature: new ForgeRaiseTemperature(config.ForgeRaiseTemperature, abilityEvent, forgeManager),
        ForgeMaintainTemperature: new ForgeMaintainTemperature(config.ForgeMaintainTemperature, abilityEvent, forgeManager),
        NetEnsnare: new NetEnsnare(config.NetEnsnare, abilityEvent, itemFactory),
    }

    // Order of abilities preloaded affects their order in the spellbooks!!!
    PreloadAbilities([aProspectorSpellbook, aDefile, aFelExtraction, aDemonfruit, aFelBasin, aCrystalizeFel, aEyeOfKilrogg, aTransferFel]);
    PreloadAbilities([aArtisanSpellbook, aCrudeAxe, aCrudePickaxe, aTransmute, aTransmuteRock, aTransmuteIron, aTransmuteCopper, aHellForge, aWorkstation, aTransmuter, aMinecart, aMineshaft]);
    PreloadAbilities([aArtisanFelsmithing, aForgeSteel, aForgeFelSteel, aForgeBuildingTools, aForgeSoulGem]);
    PreloadAbilities([aResearcherSpellbook, aStudy, aOrganicMatter, aNet, aExperimentChamber, aAutomaton, aFelInjector, aDepot, aObliterum]);
    PreloadAbilities([researcherW, aResearchTank, aResearchConverter, aResearchAutomaton, aResearchDepot]);

    // Tools
    toolManager.RegisterTool('IT00', abilities.Axe, 1);
    toolManager.RegisterTool('IT02', abilities.Axe, 2);
    toolManager.RegisterTool('IT01', abilities.Pickaxe, 1);
    toolManager.RegisterTool('IT03', abilities.Pickaxe, 2);
    // toolManager.RegisterTool('IT06', )

    // Machines
    // const workstation = new WorkstationMachine(config.WorkstationMachine, Unit.fromHandle(gg_unit_h000_0016), errorService, craftingManager, itemFactory);

    heroManager.Initialize(abilities);
    Global.soulAnchor.removeAbility(aDimensionalGate.id);
    Global.soulAnchor.addAbility(aDimensionalGate.id);

    let cam = new Trigger();
    cam.registerPlayerChatEvent(MapPlayer.fromLocal(), '-cam', false);
    cam.addAction(() => {
        let str = GetEventPlayerChatString();
        let number: number = 3000;
        let ind = 0;
        if (str.startsWith('-cam '))
            ind = 5;
        else if (str == '-cam') {
            number = 3000;
            ind = 5;
        } else if (str.startsWith('-zoom ')) {
            ind = 6;
        } else {
            return;
        }
        let n = S2I(string.sub(str, ind));
        if (n != 0) number = n;
        print("Camera distance set to ", number);
        SetCameraFieldForPlayer(MapPlayer.fromEvent().handle, CAMERA_FIELD_TARGET_DISTANCE, number, 0.5);
        SetCameraFieldForPlayer(MapPlayer.fromEvent().handle, CAMERA_FIELD_FARZ, 100000, 0.5);
    });
    
    InitCommands(config, inputHandler, abilityEvent, basicSlotManager, specialSlotManager, heroManager);
    
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

    // let playerAnchorOrder: Record<number, number> = {};

    // let anchorOrder = new Trigger();
    // anchorOrder.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_ORDER);
    // anchorOrder.addAction(() => {
    //     if (GetTriggerUnit() != Global.soulAnchor.handle) return;
    //     let playerId = MapPlayer.fromEvent().id;
    //     print(playerId);
    //     let count = playerAnchorOrder[playerId] || 0;
    //     playerAnchorOrder[playerId] = count + 1;
    // });

    // let anchorOrderTim = new Timer();
    // anchorOrderTim.start(1, true, () => {
    //     for (let p of config.players) {
    //         if (playerAnchorOrder[p.id] >= 5) {
    //             errorService.DisplayError(p, "You have issued too much orders. Removing control.");
    //             SetPlayerAllianceStateBJ(sharedPlayer.handle, p.handle, bj_ALLIANCE_ALLIED_UNITS);
    //         }
    //         playerAnchorOrder[p.id] = 0;
    //     }
    // });

    // Quests
    // for (let i = 0; i < 10; i++) {
    //     let quest = new Quest("quest" + i, "Text Quest " + i);
    //     questManager.AddQuestToPool(quest);
    // }

    let codeArt = new Color(0, 0, 255).code + 'A|r: ';
    let codePro = new Color(0, 255, 0).code + 'P|r: ';
    let codeRes = new Color(255, 0, 255).code + 'R|r: ';

    questManager.AddQuestToPool(
        new ItemQuest("fourRocks", 'Find 4 Rocks', questManager, craftingManager, itemFactory,
        [[1, Material.Unique, ResourceItem.Rock]], 4, [[2, ResourceItem.Rock]]));
    questManager.AddQuestToPool(
        new ItemQuest("sixSticks", 'Gather 6 Sticks', questManager, craftingManager, itemFactory,
        [[1, Material.Unique, ResourceItem.WoodI]], 6, [[4, ResourceItem.WoodI]]));

    questManager.AddQuestToPool(
        new ItemQuest("crudeAxes", codeArt + 'Make two Crude Axe', questManager, craftingManager, itemFactory,
        [[1, Material.Unique, Tools.CrudeAxeI]], 2, [[2, ResourceItem.Rock]]));
    questManager.AddQuestToPool(
        new AbilityUsedQuest("felCrystal", codePro + 'Make Crystalized Fel', questManager, itemFactory, abilityEvent,
        aCrystalizeFel.id, 1, [[1, ResourceItem.CrystalizedFel100]], false));
    questManager.AddQuestToPool(
        new ItemQuest("sixNets", codeRes + 'Make six Nets', questManager, craftingManager, itemFactory,
        [[1, Material.Unique, Tools.Net]], 6, [[2, Tools.Net]]));

    questManager.AddQuestToPool(
        new ItemQuest("crudePix", codeArt + 'Make a Crude Pickaxe', questManager, craftingManager, itemFactory,
        [[1, Material.Unique, Tools.CrudePickaxeI]], 1, [[3, ResourceItem.Rock]]));
    questManager.AddQuestToPool(
        new ItemQuest("animals", 'Catch six animals', questManager, craftingManager, itemFactory,
        [[1, Material.Animal]], 6, [[1, Animal.Frog]]));
    questManager.AddQuestToPool(
        new ItemQuest("logs", 'Gather six Logs', questManager, craftingManager, itemFactory,
        [[1, Material.Unique, ResourceItem.Log]], 6, [[1, ResourceItem.Log]]));
    questManager.AddQuestToPool(
        new ItemQuest("stones", 'Gather eight Stones', questManager, craftingManager, itemFactory,
        [[1, Material.Unique, ResourceItem.Stone]], 8, [[1, ResourceItem.Stone]]));

    questManager.AddQuestToPool(
        new BuildingQuest("workstation", codeArt + 'Build a Workstation', questManager, itemFactory,
        aWorkstation.builtUnitId, 1, [[1, ResourceItem.StoneII], [1, ResourceItem.WoodII]]));
    questManager.AddQuestToPool(
        new ItemQuest("organicMatter", codeRes + 'Make an Organic Matter', questManager, craftingManager, itemFactory,
        [[1, Material.Unique, ResourceItem.OrganicMatter]], 1, [[1, Animal.Rabbit]]));
    questManager.AddQuestToPool(
        new AbilityUsedQuest("demonfruitTree", codePro + 'Grow a Demonfruit tree', questManager, itemFactory, abilityEvent,
        aDemonfruit.id, 1, [[1, ResourceItem.OrganicMatter]]));

    questManager.AddQuestToPool(
        new ItemQuest("irons", codeArt + 'Transmute 10 Iron', questManager, craftingManager, itemFactory,
        [[1, Material.Unique, ResourceItem.Iron]], 10, [[2, ResourceItem.Iron]]));
    questManager.AddQuestToPool(
        new ResearchQuest("tankResearch", codeRes + "Research Tank I", questManager, itemFactory, abilityEvent,
        aResearchTank.id, FourCC('R001'), [[2, ResourceItem.Iron]]));
    
    questManager.AddQuestToPool(
        new ItemQuest("frame1", 'Make four Frame I', questManager, craftingManager, itemFactory,
        [[1, Material.Unique, ComponentItem.FrameI]], 4, [[1, ComponentItem.FrameI]]));
    questManager.AddQuestToPool(
        new ItemQuest("demonfruit", 'Gather 6 demonfruit', questManager, craftingManager, itemFactory,
        [[1, Material.Unique, ResourceItem.Demonfruit]], 6, [[4, ResourceItem.Demonfruit]]));
    questManager.AddQuestToPool(
        new ItemQuest("tankComp", 'Craft Tank I in Workstation', questManager, craftingManager, itemFactory,
        [[1, Material.Tank | Material.TierI]], 1, [[2, ResourceItem.Iron]]));

    questManager.AddQuestToPool(
        new BuildingQuest("expChamber", codeRes + 'Build an Experiment Chamber', questManager, itemFactory,
        aExperimentChamber.builtUnitId, 1, [[1, ResourceItem.OrganicMatter]]));
    questManager.AddQuestToPool(
        new BuildingQuest("felBasin", codePro + 'Build a Fel Basin', questManager, itemFactory,
        aFelBasin.builtUnitId, 1, [[1, ResourceItem.CrystalizedFel100]], false));
    questManager.AddQuestToPool(
        new BuildingQuest("hellForge", codeArt + 'Build a Hell Forge', questManager, itemFactory,
        aHellForge.builtUnitId, 1, [[3, ResourceItem.Iron]]));

    questManager.AddQuestToPool(
        new ItemQuest("tankComp", 'Make 2 Steel', questManager, craftingManager, itemFactory,
        [[1, Material.Unique, ResourceItem.Steel]], 2, [[1, ResourceItem.Iron]]));

    // UI
    let questsView = CreateQuestView(Frame.fromOrigin(ORIGIN_FRAME_GAME_UI, 0));
    let questsViewModel = new QuestViewModel(questsView, questEvent, questManager, heroManager);
    // msgFrame.width = 1;
    // print(msgFrame.width, msgFrame.height);

    // AI
    const aiController = new AiController(surfaceRect, enemyPlayer, mapGenerator.enemySpawnPoints, config.players);
});
}

function PreloadAbilities(abilities: { Preload: (dummy: Unit) => void }[]) {

    let dummy = new Unit(21, FourCC('nDUM'), 0, 0, 0);

    for (let a of abilities) {
        a.Preload(dummy);
    }

    dummy.kill();
    dummy.destroy();
}