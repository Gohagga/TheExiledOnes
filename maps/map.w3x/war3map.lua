udg_u = nil
gg_rct_UndergroundMap = nil
gg_rct_SurfaceMap = nil
gg_rct_TestSurface = nil
gg_rct_TestUnderground = nil
gg_trg_Initialization = nil
gg_trg_Untitled_Trigger_003 = nil
gg_trg_Untitled_Trigger_001 = nil
gg_trg_Untitled_Trigger_002 = nil
gg_trg_Untitled_Trigger_004 = nil
gg_trg_Untitled_Trigger_005 = nil
gg_trg_Untitled_Trigger_005_Copy = nil
gg_trg_Untitled_Trigger_006 = nil
gg_trg_Untitled_Trigger_007 = nil
gg_trg_Share = nil
gg_unit_Hblm_0003 = nil
gg_unit_h000_0016 = nil
function InitGlobals()
end

function CreateAllItems()
    local itemID
    BlzCreateItemWithSkin(FourCC("IMF1"), -11991.6, -12351.6, FourCC("IMF1"))
    BlzCreateItemWithSkin(FourCC("IMF1"), -11968.2, -12421.3, FourCC("IMF1"))
    BlzCreateItemWithSkin(FourCC("IMF1"), -12028.1, -12287.1, FourCC("IMF1"))
    BlzCreateItemWithSkin(FourCC("IMF1"), -11931.7, -12485.8, FourCC("IMF1"))
    BlzCreateItemWithSkin(FourCC("IMF2"), -12100.4, -12597.7, FourCC("IMF2"))
    BlzCreateItemWithSkin(FourCC("IMF2"), -12145.3, -12538.8, FourCC("IMF2"))
    BlzCreateItemWithSkin(FourCC("IMF2"), -12160.3, -12463.5, FourCC("IMF2"))
    BlzCreateItemWithSkin(FourCC("IMF2"), -12205.2, -12404.6, FourCC("IMF2"))
    BlzCreateItemWithSkin(FourCC("IMF3"), -11870.9, -12409.9, FourCC("IMF3"))
    BlzCreateItemWithSkin(FourCC("IMF3"), -11930.8, -12275.7, FourCC("IMF3"))
    BlzCreateItemWithSkin(FourCC("IMF3"), -11834.5, -12474.4, FourCC("IMF3"))
    BlzCreateItemWithSkin(FourCC("IMF3"), -11894.4, -12340.2, FourCC("IMF3"))
    BlzCreateItemWithSkin(FourCC("IMM1"), -12334.9, -12310.3, FourCC("IMM1"))
    BlzCreateItemWithSkin(FourCC("IMM1"), -12022.8, -12494.6, FourCC("IMM1"))
    BlzCreateItemWithSkin(FourCC("IMM1"), -12238.5, -12509.0, FourCC("IMM1"))
    BlzCreateItemWithSkin(FourCC("IMM1"), -12275.0, -12444.5, FourCC("IMM1"))
    BlzCreateItemWithSkin(FourCC("IMM1"), -12059.3, -12430.1, FourCC("IMM1"))
    BlzCreateItemWithSkin(FourCC("IMM1"), -12119.2, -12295.9, FourCC("IMM1"))
    BlzCreateItemWithSkin(FourCC("IMM1"), -12298.4, -12374.8, FourCC("IMM1"))
    BlzCreateItemWithSkin(FourCC("IMM1"), -12082.7, -12360.5, FourCC("IMM1"))
    BlzCreateItemWithSkin(FourCC("IMM2"), -12200.1, -12159.4, FourCC("IMM2"))
    BlzCreateItemWithSkin(FourCC("IMM2"), -12174.6, -12208.2, FourCC("IMM2"))
    BlzCreateItemWithSkin(FourCC("IMM3"), -12157.7, -12069.4, FourCC("IMM3"))
    BlzCreateItemWithSkin(FourCC("IMM3"), -12172.2, -12030.5, FourCC("IMM3"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -11118.6, -12628.7, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -11154.0, -12407.4, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -11183.7, -12428.1, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -11179.3, -12578.5, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -11401.2, -12967.5, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -11028.7, -13103.6, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -11904.9, -12042.2, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -11071.5, -12417.8, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -11026.3, -12548.1, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -11056.1, -12568.8, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -10995.4, -12618.9, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -11009.3, -12427.0, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -11039.1, -12447.8, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -10978.4, -12497.9, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -11149.5, -12557.8, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -11102.4, -12347.0, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -11132.2, -12367.7, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -10908.6, -12816.3, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -11371.4, -12946.8, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -11912.6, -11928.0, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS1"), -11123.0, -12478.2, FourCC("IMS1"))
    BlzCreateItemWithSkin(FourCC("IMS2"), -11332.2, -12640.5, FourCC("IMS2"))
    BlzCreateItemWithSkin(FourCC("IMS2"), -11465.3, -12677.0, FourCC("IMS2"))
    BlzCreateItemWithSkin(FourCC("IMS2"), -11420.1, -12621.1, FourCC("IMS2"))
    BlzCreateItemWithSkin(FourCC("IMS2"), -11375.7, -13046.6, FourCC("IMS2"))
    BlzCreateItemWithSkin(FourCC("IMS2"), -11352.6, -13101.9, FourCC("IMS2"))
    BlzCreateItemWithSkin(FourCC("IMS2"), -11485.7, -13138.4, FourCC("IMS2"))
    BlzCreateItemWithSkin(FourCC("IMS2"), -11440.5, -13082.6, FourCC("IMS2"))
    BlzCreateItemWithSkin(FourCC("IMS2"), -11355.3, -12585.2, FourCC("IMS2"))
    BlzCreateItemWithSkin(FourCC("IMS3"), -11121.9, -13065.0, FourCC("IMS3"))
    BlzCreateItemWithSkin(FourCC("IMS3"), -11199.7, -13041.0, FourCC("IMS3"))
    BlzCreateItemWithSkin(FourCC("IMS3"), -11235.9, -13146.0, FourCC("IMS3"))
    BlzCreateItemWithSkin(FourCC("IMS3"), -11180.7, -13104.7, FourCC("IMS3"))
    BlzCreateItemWithSkin(FourCC("IMW1"), -11348.3, -12502.4, FourCC("IMW1"))
    BlzCreateItemWithSkin(FourCC("IMW1"), -11805.1, -11953.8, FourCC("IMW1"))
    BlzCreateItemWithSkin(FourCC("IMW1"), -11484.8, -12967.5, FourCC("IMW1"))
    BlzCreateItemWithSkin(FourCC("IMW1"), -11492.7, -12886.8, FourCC("IMW1"))
    BlzCreateItemWithSkin(FourCC("IMW1"), -11848.4, -11986.4, FourCC("IMW1"))
    BlzCreateItemWithSkin(FourCC("IMW1"), -11356.2, -12421.7, FourCC("IMW1"))
    BlzCreateItemWithSkin(FourCC("IMW2"), -11387.1, -12886.8, FourCC("IMW2"))
    BlzCreateItemWithSkin(FourCC("IMW2"), -11308.7, -12946.8, FourCC("IMW2"))
    BlzCreateItemWithSkin(FourCC("IMW2"), -11484.7, -13040.0, FourCC("IMW2"))
    BlzCreateItemWithSkin(FourCC("IMW2"), -11375.4, -13182.0, FourCC("IMW2"))
    BlzCreateItemWithSkin(FourCC("IPC1"), -11533.1, -12407.2, FourCC("IPC1"))
    BlzCreateItemWithSkin(FourCC("IPC1"), -11719.1, -11993.5, FourCC("IPC1"))
    BlzCreateItemWithSkin(FourCC("IPC2"), -11542.0, -12288.0, FourCC("IPC2"))
    BlzCreateItemWithSkin(FourCC("IPC2"), -11723.5, -11911.7, FourCC("IPC2"))
    BlzCreateItemWithSkin(FourCC("IPC3"), -11533.2, -12189.6, FourCC("IPC3"))
    BlzCreateItemWithSkin(FourCC("IPC3"), -11666.5, -11915.9, FourCC("IPC3"))
    BlzCreateItemWithSkin(FourCC("IPC4"), -11662.0, -11996.5, FourCC("IPC4"))
    BlzCreateItemWithSkin(FourCC("IPC4"), -11538.1, -12059.4, FourCC("IPC4"))
    BlzCreateItemWithSkin(FourCC("IPF1"), -11785.9, -12425.6, FourCC("IPF1"))
    BlzCreateItemWithSkin(FourCC("IPF2"), -11817.6, -12335.7, FourCC("IPF2"))
    BlzCreateItemWithSkin(FourCC("IPF3"), -11827.1, -12242.4, FourCC("IPF3"))
    BlzCreateItemWithSkin(FourCC("IPF4"), -11831.4, -12133.9, FourCC("IPF4"))
    BlzCreateItemWithSkin(FourCC("IPM1"), -11699.0, -12409.1, FourCC("IPM1"))
    BlzCreateItemWithSkin(FourCC("IPM2"), -11699.3, -12310.7, FourCC("IPM2"))
    BlzCreateItemWithSkin(FourCC("IPM3"), -11697.8, -12210.6, FourCC("IPM3"))
    BlzCreateItemWithSkin(FourCC("IPM4"), -11695.7, -12109.0, FourCC("IPM4"))
    BlzCreateItemWithSkin(FourCC("IPT1"), -11610.5, -12413.1, FourCC("IPT1"))
    BlzCreateItemWithSkin(FourCC("IPT2"), -11614.4, -12319.8, FourCC("IPT2"))
    BlzCreateItemWithSkin(FourCC("IPT3"), -11614.1, -12209.0, FourCC("IPT3"))
    BlzCreateItemWithSkin(FourCC("IPT4"), -11611.5, -12089.3, FourCC("IPT4"))
    BlzCreateItemWithSkin(FourCC("IT00"), -11185.3, -12839.9, FourCC("IT00"))
    BlzCreateItemWithSkin(FourCC("IT01"), -11446.4, -12398.7, FourCC("IT01"))
    BlzCreateItemWithSkin(FourCC("IT01"), -11275.6, -13069.0, FourCC("IT01"))
    BlzCreateItemWithSkin(FourCC("IT01"), -11149.5, -12968.9, FourCC("IT01"))
    BlzCreateItemWithSkin(FourCC("IT03"), -11447.3, -12282.6, FourCC("IT03"))
    BlzCreateItemWithSkin(FourCC("IT04"), -11442.9, -12172.8, FourCC("IT04"))
    BlzCreateItemWithSkin(FourCC("IT05"), -11449.7, -12092.7, FourCC("IT05"))
end

function CreateBuildingsForPlayer0()
    local p = Player(0)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("halt"), -11424.0, -11744.0, 270.000, FourCC("halt"))
    u = BlzCreateUnitWithSkin(p, FourCC("h003"), -10880.0, -11712.0, 270.000, FourCC("h003"))
    u = BlzCreateUnitWithSkin(p, FourCC("h004"), -10944.0, -11456.0, 270.000, FourCC("h004"))
    u = BlzCreateUnitWithSkin(p, FourCC("ntnt"), -7648.0, -10912.0, 270.000, FourCC("ntnt"))
    u = BlzCreateUnitWithSkin(p, FourCC("nfh0"), -8064.0, -11008.0, 270.000, FourCC("nfh0"))
    u = BlzCreateUnitWithSkin(p, FourCC("nfh1"), -7840.0, -10976.0, 270.000, FourCC("nfh1"))
end

function CreateUnitsForPlayer0()
    local p = Player(0)
    local u
    local unitID
    local t
    local life
    gg_unit_Hblm_0003 = BlzCreateUnitWithSkin(p, FourCC("Hblm"), -12075.0, -12160.3, 3.210, FourCC("Hblm"))
    UnitAddItemToSlotById(gg_unit_Hblm_0003, FourCC("IM01"), 0)
    UnitAddItemToSlotById(gg_unit_Hblm_0003, FourCC("IM01"), 1)
    UnitAddItemToSlotById(gg_unit_Hblm_0003, FourCC("IM01"), 2)
    UnitAddItemToSlotById(gg_unit_Hblm_0003, FourCC("IM00"), 3)
    UnitAddItemToSlotById(gg_unit_Hblm_0003, FourCC("IM00"), 4)
    UnitAddItemToSlotById(gg_unit_Hblm_0003, FourCC("IM00"), 5)
    u = BlzCreateUnitWithSkin(p, FourCC("Hblm"), -10924.6, -11345.9, 279.402, FourCC("Hblm"))
end

function CreateBuildingsForPlayer1()
    local p = Player(1)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("hvlt"), -11648.0, -11136.0, 270.000, FourCC("hvlt"))
end

function CreateBuildingsForPlayer11()
    local p = Player(11)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("uslh"), -10048.0, -11136.0, 270.000, FourCC("uslh"))
end

function CreateBuildingsForPlayer15()
    local p = Player(15)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("e000"), -7040.0, -11968.0, 270.000, FourCC("e000"))
    IssueImmediateOrder(u, "root")
    gg_unit_h000_0016 = BlzCreateUnitWithSkin(p, FourCC("h000"), -12032.0, -11840.0, 270.000, FourCC("h000"))
end

function CreatePlayerBuildings()
    CreateBuildingsForPlayer0()
    CreateBuildingsForPlayer1()
    CreateBuildingsForPlayer11()
    CreateBuildingsForPlayer15()
end

function CreatePlayerUnits()
    CreateUnitsForPlayer0()
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
    SelectUnitForPlayerSingle(gg_unit_h000_0016, Player(1))
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

function Trig_Untitled_Trigger_004_Func001C()
    if (not (GetSpellAbilityId() ~= FourCC("AHbn"))) then
        return false
    end
    return true
end

function Trig_Untitled_Trigger_004_Actions()
    if (Trig_Untitled_Trigger_004_Func001C()) then
        return 
    else
    end
    udg_u = GetTriggerUnit()
end

function InitTrig_Untitled_Trigger_004()
    gg_trg_Untitled_Trigger_004 = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(gg_trg_Untitled_Trigger_004, EVENT_PLAYER_UNIT_SPELL_EFFECT)
    TriggerAddAction(gg_trg_Untitled_Trigger_004, Trig_Untitled_Trigger_004_Actions)
end

function Trig_Untitled_Trigger_005_Actions()
    udg_u = GroupPickRandomUnit(GetUnitsSelectedAll(Player(0)))
    PauseUnitBJ(true, GroupPickRandomUnit(GetUnitsSelectedAll(Player(0))))
end

function InitTrig_Untitled_Trigger_005()
    gg_trg_Untitled_Trigger_005 = CreateTrigger()
    TriggerRegisterPlayerChatEvent(gg_trg_Untitled_Trigger_005, Player(0), "-pause", true)
    TriggerAddAction(gg_trg_Untitled_Trigger_005, Trig_Untitled_Trigger_005_Actions)
end

function Trig_Untitled_Trigger_005_Copy_Actions()
    udg_u = GroupPickRandomUnit(GetUnitsSelectedAll(Player(0)))
    SetPlayerAbilityAvailableBJ(true, FourCC("A005"), Player(0))
end

function InitTrig_Untitled_Trigger_005_Copy()
    gg_trg_Untitled_Trigger_005_Copy = CreateTrigger()
    TriggerRegisterPlayerChatEvent(gg_trg_Untitled_Trigger_005_Copy, Player(0), "-unpause", true)
    TriggerAddAction(gg_trg_Untitled_Trigger_005_Copy, Trig_Untitled_Trigger_005_Copy_Actions)
end

function Trig_Untitled_Trigger_006_Actions()
    IssueTrainOrderByIdBJ(gg_unit_h000_0016, FourCC("oPM1"))
end

function InitTrig_Untitled_Trigger_006()
    gg_trg_Untitled_Trigger_006 = CreateTrigger()
    TriggerRegisterPlayerChatEvent(gg_trg_Untitled_Trigger_006, Player(0), "-train", true)
    TriggerAddAction(gg_trg_Untitled_Trigger_006, Trig_Untitled_Trigger_006_Actions)
end

function Trig_Untitled_Trigger_007_Actions()
    DisplayTextToForce(GetPlayersAll(), "TRIGSTR_461")
    DisplayTextToForce(GetPlayersAll(), GetUnitName(GetTriggerUnit()))
end

function InitTrig_Untitled_Trigger_007()
    gg_trg_Untitled_Trigger_007 = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(gg_trg_Untitled_Trigger_007, EVENT_PLAYER_UNIT_SELL_ITEM)
    TriggerAddAction(gg_trg_Untitled_Trigger_007, Trig_Untitled_Trigger_007_Actions)
end

function Trig_Share_Func002C()
    if (not (IsUnitType(udg_u, UNIT_TYPE_STRUCTURE) == true)) then
        return false
    end
    return true
end

function Trig_Share_Actions()
    udg_u = GroupPickRandomUnit(GetUnitsSelectedAll(Player(0)))
    if (Trig_Share_Func002C()) then
        SetUnitOwner(udg_u, Player(20), true)
    else
    end
end

function InitTrig_Share()
    gg_trg_Share = CreateTrigger()
    TriggerRegisterPlayerChatEvent(gg_trg_Share, Player(0), "-share", true)
    TriggerAddAction(gg_trg_Share, Trig_Share_Actions)
end

function InitCustomTriggers()
    InitTrig_Initialization()
    InitTrig_Untitled_Trigger_003()
    InitTrig_Untitled_Trigger_001()
    InitTrig_Untitled_Trigger_004()
    InitTrig_Untitled_Trigger_005()
    InitTrig_Untitled_Trigger_005_Copy()
    InitTrig_Untitled_Trigger_006()
    InitTrig_Untitled_Trigger_007()
    InitTrig_Share()
end

function RunInitializationTriggers()
    ConditionalTriggerExecute(gg_trg_Initialization)
end

function InitCustomPlayerSlots()
    SetPlayerStartLocation(Player(0), 0)
    ForcePlayerStartLocation(Player(0), 0)
    SetPlayerColor(Player(0), ConvertPlayerColor(0))
    SetPlayerRacePreference(Player(0), RACE_PREF_UNDEAD)
    SetPlayerRaceSelectable(Player(0), false)
    SetPlayerController(Player(0), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(1), 1)
    ForcePlayerStartLocation(Player(1), 1)
    SetPlayerColor(Player(1), ConvertPlayerColor(1))
    SetPlayerRacePreference(Player(1), RACE_PREF_UNDEAD)
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
    SetPlayerRacePreference(Player(3), RACE_PREF_UNDEAD)
    SetPlayerRaceSelectable(Player(3), false)
    SetPlayerController(Player(3), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(11), 4)
    ForcePlayerStartLocation(Player(11), 4)
    SetPlayerColor(Player(11), ConvertPlayerColor(11))
    SetPlayerRacePreference(Player(11), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(11), false)
    SetPlayerController(Player(11), MAP_CONTROL_COMPUTER)
    SetPlayerStartLocation(Player(15), 5)
    ForcePlayerStartLocation(Player(15), 5)
    SetPlayerColor(Player(15), ConvertPlayerColor(15))
    SetPlayerRacePreference(Player(15), RACE_PREF_UNDEAD)
    SetPlayerRaceSelectable(Player(15), false)
    SetPlayerController(Player(15), MAP_CONTROL_NEUTRAL)
    SetPlayerStartLocation(Player(20), 6)
    ForcePlayerStartLocation(Player(20), 6)
    SetPlayerColor(Player(20), ConvertPlayerColor(20))
    SetPlayerRacePreference(Player(20), RACE_PREF_UNDEAD)
    SetPlayerRaceSelectable(Player(20), false)
    SetPlayerController(Player(20), MAP_CONTROL_NEUTRAL)
end

function InitCustomTeams()
    SetPlayerTeam(Player(0), 0)
    SetPlayerState(Player(0), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(1), 0)
    SetPlayerState(Player(1), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(2), 0)
    SetPlayerState(Player(2), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(3), 0)
    SetPlayerState(Player(3), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(15), 0)
    SetPlayerState(Player(15), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(20), 0)
    SetPlayerState(Player(20), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(15), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(20), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(15), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(20), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(15), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(20), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(15), true)
    SetPlayerAllianceStateAllyBJ(Player(3), Player(20), true)
    SetPlayerAllianceStateAllyBJ(Player(15), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(15), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(15), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(15), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(15), Player(20), true)
    SetPlayerAllianceStateAllyBJ(Player(20), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(20), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(20), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(20), Player(3), true)
    SetPlayerAllianceStateAllyBJ(Player(20), Player(15), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(15), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(20), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(15), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(20), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(15), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(20), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(15), true)
    SetPlayerAllianceStateVisionBJ(Player(3), Player(20), true)
    SetPlayerAllianceStateVisionBJ(Player(15), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(15), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(15), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(15), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(15), Player(20), true)
    SetPlayerAllianceStateVisionBJ(Player(20), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(20), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(20), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(20), Player(3), true)
    SetPlayerAllianceStateVisionBJ(Player(20), Player(15), true)
    SetPlayerAllianceStateControlBJ(Player(0), Player(1), true)
    SetPlayerAllianceStateControlBJ(Player(0), Player(2), true)
    SetPlayerAllianceStateControlBJ(Player(0), Player(3), true)
    SetPlayerAllianceStateControlBJ(Player(0), Player(15), true)
    SetPlayerAllianceStateControlBJ(Player(0), Player(20), true)
    SetPlayerAllianceStateControlBJ(Player(1), Player(0), true)
    SetPlayerAllianceStateControlBJ(Player(1), Player(2), true)
    SetPlayerAllianceStateControlBJ(Player(1), Player(3), true)
    SetPlayerAllianceStateControlBJ(Player(1), Player(15), true)
    SetPlayerAllianceStateControlBJ(Player(1), Player(20), true)
    SetPlayerAllianceStateControlBJ(Player(2), Player(0), true)
    SetPlayerAllianceStateControlBJ(Player(2), Player(1), true)
    SetPlayerAllianceStateControlBJ(Player(2), Player(3), true)
    SetPlayerAllianceStateControlBJ(Player(2), Player(15), true)
    SetPlayerAllianceStateControlBJ(Player(2), Player(20), true)
    SetPlayerAllianceStateControlBJ(Player(3), Player(0), true)
    SetPlayerAllianceStateControlBJ(Player(3), Player(1), true)
    SetPlayerAllianceStateControlBJ(Player(3), Player(2), true)
    SetPlayerAllianceStateControlBJ(Player(3), Player(15), true)
    SetPlayerAllianceStateControlBJ(Player(3), Player(20), true)
    SetPlayerAllianceStateControlBJ(Player(15), Player(0), true)
    SetPlayerAllianceStateControlBJ(Player(15), Player(1), true)
    SetPlayerAllianceStateControlBJ(Player(15), Player(2), true)
    SetPlayerAllianceStateControlBJ(Player(15), Player(3), true)
    SetPlayerAllianceStateControlBJ(Player(15), Player(20), true)
    SetPlayerAllianceStateControlBJ(Player(20), Player(0), true)
    SetPlayerAllianceStateControlBJ(Player(20), Player(1), true)
    SetPlayerAllianceStateControlBJ(Player(20), Player(2), true)
    SetPlayerAllianceStateControlBJ(Player(20), Player(3), true)
    SetPlayerAllianceStateControlBJ(Player(20), Player(15), true)
    SetPlayerTeam(Player(11), 1)
    SetPlayerState(Player(11), PLAYER_STATE_ALLIED_VICTORY, 1)
end

function InitAllyPriorities()
    SetStartLocPrioCount(0, 3)
    SetStartLocPrio(0, 0, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(0, 1, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(0, 2, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(1, 3)
    SetStartLocPrio(1, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(1, 1, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(1, 2, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(2, 3)
    SetStartLocPrio(2, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(2, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(2, 2, 3, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(3, 3)
    SetStartLocPrio(3, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(3, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(3, 2, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(4, 3)
    SetStartLocPrio(4, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 1, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(5, 3)
    SetStartLocPrio(5, 0, 4, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(5, 1, 6, MAP_LOC_PRIO_LOW)
    SetStartLocPrioCount(6, 2)
    SetStartLocPrio(6, 0, 4, MAP_LOC_PRIO_LOW)
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
    SetPlayers(7)
    SetTeams(7)
    SetGamePlacement(MAP_PLACEMENT_TEAMS_TOGETHER)
    DefineStartLocation(0, -1408.0, 320.0)
    DefineStartLocation(1, -1408.0, 320.0)
    DefineStartLocation(2, -1408.0, 320.0)
    DefineStartLocation(3, -1408.0, 320.0)
    DefineStartLocation(4, -1408.0, 320.0)
    DefineStartLocation(5, -1408.0, 320.0)
    DefineStartLocation(6, -10560.0, -11776.0)
    InitCustomPlayerSlots()
    InitCustomTeams()
    InitAllyPriorities()
end

