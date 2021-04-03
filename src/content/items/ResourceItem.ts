export enum ResourceItem {
    Rock = FourCC('IMS1'),
    StoneI = FourCC('IMS1'),
    Stone = FourCC('IMS2'),
    StoneII = FourCC('IMS2'),
    Felstone = FourCC('IMS3'),
    StoneIII = FourCC('IMS3'),

    Branch = FourCC('IMW1'),
    WoodI = FourCC('IMW1'),
    Log = FourCC('IMW2'),
    WoodII = FourCC('IMW2'),
    Felwood = FourCC('IMW3'),
    WoodIII = FourCC('IMW3'),
    
    Iron = FourCC('IMM1'),

    Copper = FourCC('IMF1'),
    Silver = FourCC('IMF2'),
    Gold = FourCC('IMF3'),
    // Electrum = FourCC('IMF1'),
}

export enum ComponentItem {
    MechanismI          = FourCC('IPM1'),
    MechanismII         = FourCC('IPM2'),
    MechanismIII        = FourCC('IPM3'),
    MechanismIV         = FourCC('IPM4'),

    FrameI              = FourCC('IPF1'),
    FrameII             = FourCC('IPF2'),
    FrameIII            = FourCC('IPF3'),
    FrameIV             = FourCC('IPF4'),
}