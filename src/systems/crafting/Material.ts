export const TierStart = 1 << 0;
export const TierEnd = 1 << 4;
export const InvertTier = 1 << 5;
export const AllTiers = Material.TierI | Material.TierII | Material.TierIII | Material.TierIV


export const enum Material {
    Unique = 1 << 0,

    TierI = 1 << 1,
    TierII = 1 << 2,
    TierIII = 1 << 3,
    TierIV = 1 << 4,
    AnyTier = (1 << 5) | TierI | TierII | TierIII | TierIV,

    Wood = 1 << 10,
    Stone = 1 << 11,
    Metal = 1 << 12,
    FineMetal = 1 << 13,

    Mechanism = 1 << 20,
    Frame = 1 << 21,
    Tank = 1 << 22,
    Converter = 1 << 23,
    Resonator = 1 << 24,

    Animal = 1 << 25,
    OrganicMatter = 1 << 26,
    FelExtraction = 1 << 27,
}


// WoodAny     = 1 << Material.WoodI | Material.WoodII | Material.WoodIII | Material.WoodIV,