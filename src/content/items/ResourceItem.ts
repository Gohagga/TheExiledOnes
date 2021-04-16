export enum ResourceItem {
    Rock                = FourCC('IMS1'),
    StoneI              = FourCC('IMS1'),
    Stone               = FourCC('IMS2'),
    StoneII             = FourCC('IMS2'),
    Felstone            = FourCC('IMS3'),
    StoneIII            = FourCC('IMS3'),

    Branch              = FourCC('IMW1'),
    WoodI               = FourCC('IMW1'),
    Log                 = FourCC('IMW2'),
    WoodII              = FourCC('IMW2'),
    Felwood             = FourCC('IMW3'),
    WoodIII             = FourCC('IMW3'),
    
    Iron                = FourCC('IMM1'),
    Steel               = FourCC('IMM2'),
    FelSteel            = FourCC('IMM3'),

    Copper              = FourCC('IMF1'),
    Silver              = FourCC('IMF2'),
    Gold                = FourCC('IMF3'),

    OrganicMatter       = FourCC('IM04'),
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

    TankI              = FourCC('IPT1'),
    TankII             = FourCC('IPT2'),
    TankIII            = FourCC('IPT3'),
    TankIV             = FourCC('IPT4'),

    ConverterI         = FourCC('IPC1'),
    ConverterII        = FourCC('IPC2'),
    ConverterIII       = FourCC('IPC3'),
    ConverterIV        = FourCC('IPC4'),

    ResonatorI         = FourCC('IPR1'),
    ResonatorII        = FourCC('IPR2'),
    ResonatorIII       = FourCC('IPR3'),
    ResonatorIV        = FourCC('IPR4'),
}