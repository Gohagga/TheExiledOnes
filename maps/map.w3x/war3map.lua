gg_rct_UndergroundMap = nil
gg_rct_SurfaceMap = nil
gg_rct_TestSurface = nil
gg_rct_TestUnderground = nil
gg_trg_Initialization = nil
gg_trg_Untitled_Trigger_003 = nil
gg_trg_Untitled_Trigger_001 = nil
gg_trg_Untitled_Trigger_002 = nil
gg_unit_Hblm_0003 = nil
gg_unit_Hpal_0002 = nil
function InitGlobals()
end

function CreateAllItems()
    local itemID
    BlzCreateItemWithSkin(FourCC("IM00"), -11202.3, -13031.8, FourCC("IM00"))
    BlzCreateItemWithSkin(FourCC("IM00"), -11010.4, -12790.9, FourCC("IM00"))
    BlzCreateItemWithSkin(FourCC("IM00"), -11163.7, -13065.2, FourCC("IM00"))
    BlzCreateItemWithSkin(FourCC("IM01"), -11332.8, -13001.1, FourCC("IM01"))
    BlzCreateItemWithSkin(FourCC("IM01"), -11288.0, -12921.2, FourCC("IM01"))
    BlzCreateItemWithSkin(FourCC("IM02"), -11213.9, -13156.2, FourCC("IM02"))
    BlzCreateItemWithSkin(FourCC("IM02"), -11122.1, -13161.0, FourCC("IM02"))
    BlzCreateItemWithSkin(FourCC("IM03"), -11366.9, -13125.4, FourCC("IM03"))
    BlzCreateItemWithSkin(FourCC("IM03"), -11330.5, -13168.8, FourCC("IM03"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -10908.6, -12816.3, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IT00"), -11185.3, -12839.9, FourCC("IT00"))
    BlzCreateItemWithSkin(FourCC("IT01"), -11149.5, -12968.9, FourCC("IT01"))
    BlzCreateItemWithSkin(FourCC("IT01"), -11275.6, -13069.0, FourCC("IT01"))
    BlzCreateItemWithSkin(FourCC("hval"), -10389.8, -12681.8, FourCC("hval"))
end

function CreateBuildingsForPlayer0()
    local p = Player(0)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("h000"), -10624.0, -13120.0, 270.000, FourCC("h000"))
end

function CreateUnitsForPlayer0()
    local p = Player(0)
    local u
    local unitID
    local t
    local life
    gg_unit_Hblm_0003 = BlzCreateUnitWithSkin(p, FourCC("Hblm"), -11106.4, -12393.6, 3.208, FourCC("Hblm"))
    u = BlzCreateUnitWithSkin(p, FourCC("Hblm"), -10535.4, -11694.8, 279.402, FourCC("Hblm"))
    u = BlzCreateUnitWithSkin(p, FourCC("hpea"), 1539.6, -1122.3, 214.328, FourCC("hpea"))
    u = BlzCreateUnitWithSkin(p, FourCC("Hblm"), -10620.7, -11459.1, 279.402, FourCC("Hblm"))
end

function CreateUnitsForPlayer1()
    local p = Player(1)
    local u
    local unitID
    local t
    local life
    gg_unit_Hpal_0002 = BlzCreateUnitWithSkin(p, FourCC("Hpal"), 237.9, -832.4, 269.898, FourCC("Hpal"))
end

function CreatePlayerBuildings()
    CreateBuildingsForPlayer0()
end

function CreatePlayerUnits()
    CreateUnitsForPlayer0()
    CreateUnitsForPlayer1()
end

function CreateAllUnits()
    CreatePlayerBuildings()
    CreatePlayerUnits()
end

function CreateRegions()
    local we
    gg_rct_UndergroundMap = Rect(-23552.0, -6784.0, -7552.0, 9216.0)
    gg_rct_SurfaceMap = Rect(-6784.0, -6784.0, 9216.0, 9216.0)
    gg_rct_TestSurface = Rect(-4448.0, -2784.0, 1696.0, 3360.0)
    gg_rct_TestUnderground = Rect(-18656.0, -2944.0, -12512.0, 3200.0)
end

--
function Trig_Initialization_Actions()
    SelectUnitForPlayerSingle(gg_unit_Hblm_0003, Player(0))
    SelectUnitForPlayerSingle(gg_unit_Hpal_0002, Player(1))
end

function InitTrig_Initialization()
    gg_trg_Initialization = CreateTrigger()
    TriggerAddAction(gg_trg_Initialization, Trig_Initialization_Actions)
end

function Trig_Untitled_Trigger_003_Actions()
end

function InitTrig_Untitled_Trigger_003()
    gg_trg_Untitled_Trigger_003 = CreateTrigger()
    TriggerAddAction(gg_trg_Untitled_Trigger_003, Trig_Untitled_Trigger_003_Actions)
end

function Trig_Untitled_Trigger_001_Actions()
    SetTerrainTypeBJ(GetRectCenter(GetPlayableMapRect()), FourCC("Vrck"), -1, 1, 0)
end

function InitTrig_Untitled_Trigger_001()
    gg_trg_Untitled_Trigger_001 = CreateTrigger()
    TriggerAddAction(gg_trg_Untitled_Trigger_001, Trig_Untitled_Trigger_001_Actions)
end

function Trig_Untitled_Trigger_002_Actions()
    DisplayTextToForce(GetPlayersAll(), (GetUnitName(GetTriggerUnit()) .. (" starts " .. GetAbilityName(GetSpellAbilityId()))))
    DisplayTextToForce(GetPlayersAll(), (GetUnitName(GetTriggerUnit()) .. (" starts " .. GetAbilityName(GetSpellAbilityId()))))
    DisplayTextToForce(GetPlayersAll(), (GetUnitName(GetTriggerUnit()) .. (" orders " .. OrderId2StringBJ(GetIssuedOrderIdBJ()))))
end

function InitTrig_Untitled_Trigger_002()
    gg_trg_Untitled_Trigger_002 = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(gg_trg_Untitled_Trigger_002, EVENT_PLAYER_UNIT_SPELL_EFFECT)
    TriggerRegisterAnyUnitEventBJ(gg_trg_Untitled_Trigger_002, EVENT_PLAYER_UNIT_SPELL_CHANNEL)
    TriggerRegisterAnyUnitEventBJ(gg_trg_Untitled_Trigger_002, EVENT_PLAYER_UNIT_SPELL_CAST)
    TriggerRegisterAnyUnitEventBJ(gg_trg_Untitled_Trigger_002, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER)
    TriggerAddAction(gg_trg_Untitled_Trigger_002, Trig_Untitled_Trigger_002_Actions)
end

function InitCustomTriggers()
    InitTrig_Initialization()
    InitTrig_Untitled_Trigger_003()
    InitTrig_Untitled_Trigger_001()
    InitTrig_Untitled_Trigger_002()
end

function RunInitializationTriggers()
    ConditionalTriggerExecute(gg_trg_Initialization)
end

function InitCustomPlayerSlots()
    SetPlayerStartLocation(Player(0), 0)
    ForcePlayerStartLocation(Player(0), 0)
    SetPlayerColor(Player(0), ConvertPlayerColor(0))
    SetPlayerRacePreference(Player(0), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(0), false)
    SetPlayerController(Player(0), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(1), 1)
    ForcePlayerStartLocation(Player(1), 1)
    SetPlayerColor(Player(1), ConvertPlayerColor(1))
    SetPlayerRacePreference(Player(1), RACE_PREF_ORC)
    SetPlayerRaceSelectable(Player(1), false)
    SetPlayerController(Player(1), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(2), 2)
    ForcePlayerStartLocation(Player(2), 2)
    SetPlayerColor(Player(2), ConvertPlayerColor(2))
    SetPlayerRacePreference(Player(2), RACE_PREF_UNDEAD)
    SetPlayerRaceSelectable(Player(2), false)
    SetPlayerController(Player(2), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(3), 3)
    ForcePlayerStartLocation(Player(3), 3)
    SetPlayerColor(Player(3), ConvertPlayerColor(3))
    SetPlayerRacePreference(Player(3), RACE_PREF_NIGHTELF)
    SetPlayerRaceSelectable(Player(3), false)
    SetPlayerController(Player(3), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(11), 4)
    ForcePlayerStartLocation(Player(11), 4)
    SetPlayerColor(Player(11), ConvertPlayerColor(11))
    SetPlayerRacePreference(Player(11), RACE_PREF_NIGHTELF)
    SetPlayerRaceSelectable(Player(11), false)
    SetPlayerController(Player(11), MAP_CONTROL_COMPUTER)
end

function InitCustomTeams()
    SetPlayerTeam(Player(0), 0)
    SetPlayerTeam(Player(1), 0)
    SetPlayerTeam(Player(2), 0)
    SetPlayerTeam(Player(3), 0)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(2), true)
    SetPlayerTeam(Player(11), 1)
end

function InitAllyPriorities()
    SetStartLocPrioCount(0, 1)
    SetStartLocPrio(0, 0, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(1, 1)
    SetStartLocPrio(1, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(2, 1)
    SetStartLocPrio(2, 0, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(3, 1)
    SetStartLocPrio(3, 0, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(4, 3)
    SetStartLocPrio(4, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 1, 2, MAP_LOC_PRIO_HIGH)
end

function main()
    SetCameraBounds(-22784.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), -23040.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM), 8448.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), 8192.0 - GetCameraMargin(CAMERA_MARGIN_TOP), -22784.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), 8192.0 - GetCameraMargin(CAMERA_MARGIN_TOP), 8448.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), -23040.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM))
    SetDayNightModels("Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl")
    SetTerrainFogEx(0, 25000.0, 25000.0, 0.500, 0.000, 0.000, 0.000)
    NewSoundEnvironment("Default")
    SetAmbientDaySound("LordaeronSummerDay")
    SetAmbientNightSound("LordaeronSummerNight")
    SetMapMusic("Music", true, 0)
    CreateRegions()
    CreateAllItems()
    CreateAllUnits()
    InitBlizzard()
    InitGlobals()
    InitCustomTriggers()
    RunInitializationTriggers()
end

function config()
    SetMapName("TRIGSTR_001")
    SetMapDescription("TRIGSTR_003")
    SetPlayers(5)
    SetTeams(5)
    SetGamePlacement(MAP_PLACEMENT_TEAMS_TOGETHER)
    DefineStartLocation(0, -22272.0, -22592.0)
    DefineStartLocation(1, -22272.0, -22592.0)
    DefineStartLocation(2, 128.0, -896.0)
    DefineStartLocation(3, 128.0, -896.0)
    DefineStartLocation(4, 128.0, -896.0)
    InitCustomPlayerSlots()
    InitCustomTeams()
    InitAllyPriorities()
end

