import { HeroId } from "config/HeroType"
import { ForgeAbility } from "content/abilities/artisan/FelSmithing"
import { MineshaftWc3Ability } from "content/abilities/artisan/Mineshaft"
import { TransmuteAbility } from "content/abilities/artisan/Transmute"
import { HeroConfig, HeroType } from "content/gameplay/HeroManager"
import { ComponentItem, ResourceItem } from "content/items/ResourceItem"
import { Wc3BuildingAbility } from "systems/abilities/BuildingAbilityBase"
import { Wc3Ability, Wc3ToggleAbility } from "systems/abilities/Wc3Ability"
import { RecipeMachineConfig } from "systems/crafting/machine/MachineConfig"
import { Material } from "systems/crafting/Material"
import { ItemConfig } from "systems/items/ItemConfig"
import { MapPlayer, Quest, Unit } from "w3ts/index"

export const sharedPlayer = MapPlayer.fromIndex(15);

export namespace Global {
    export let soulAnchor: Unit;
}

export class Config {

    players: MapPlayer[] = [
        MapPlayer.fromIndex(0),
        MapPlayer.fromIndex(1),
        MapPlayer.fromIndex(2),
        MapPlayer.fromIndex(3),
        MapPlayer.fromIndex(4),
        MapPlayer.fromIndex(5),
        MapPlayer.fromIndex(6),
        MapPlayer.fromIndex(7),
        MapPlayer.fromIndex(8),
        MapPlayer.fromIndex(9)
    ]

    heroes: HeroConfig[] = [{
            name: 'Prospector',
            type: HeroType.Prospector,
            unitId: HeroId.Prospector,
        }, {
            name: 'Artisan',
            type: HeroType.Artisan,
            unitId: HeroId.Artisan,
        }, {
            name: 'Researcher',
            type: HeroType.Researcher,
            unitId: HeroId.Researcher,
        }
    ]

    quests: { title: string, icon: string, description: string }[] = [
//         {
//             title: 'Info',
//             icon: 'ReplaceableTextures\\CommandButtons\\BTNSelectHeroOn.blp',
//             description:
// `Materials are divided into types and tiers. Type of materials are Wood, Stone, Metal and Fine Metal. There are others but these are most prevalent.
// There are tiers 1-4. Examples:
// 
// Branch (Wood I), Rock (Stone I), Iron (Metal I), Copper (Fine Metal I)
// Log (Wood II), Stone (Stone II), Steel (Metal II), Silver (Fine Metal II)
// ...`
//         },
        {
            title: 'Credits',
            icon: 'ReplaceableTextures\\CommandButtons\\BTNChestOfGold.blp',
            description:
`First and foremost, Lahey (Terrania) for primary inspiration and mechanics.
ScrewTheTrees - terrain gen examples and machine ideas
Tasyen, William, Rayman.90 for help with minimap
Mayday, Ghostwolf and NemesisDSGB for support
AvatarsLord for enthusiasm and testing

Models & Lightnings
GeneralFrank, RightField, Solu9, Ergius, KAIL333XZ, Blood Raven, Kalkhran, Kenathorn, Sunchips, Spellbound, Remixer, Carrington2k, MasterHaosis, TheFallen

Icons
Dristitia, GhostThruster

Tools
Retera for RMS
`
        }];

//#region Abilities
    Defile: Wc3Ability = {
        name: 'Defile',
        codeId: 'A0P0',
        extCodeId: 'ASP0'
    }

    EyeOfKilrogg: Wc3Ability = {
        name: 'Eye of Kilrogg',
        codeId: 'A0P1',
        extCodeId: 'ASP1',
        tooltip: 'Summons two eyes for 60 seconds that can scout nearby land.'
    }

    InfuseFelstone: TransmuteAbility = {
        name: 'Infuse Felstone',
        codeId: 'A0P2',
        extCodeId: 'ASP2',
        matAmount: 3,
        material: Material.Stone | Material.TierII,
        tooltip: 'Creates a felstone material using 3 stones and 50 fel.'
    }

    CrystalizeFel: Wc3Ability = {
        name: 'Crystalize Fel',
        codeId: 'A0P3',
        extCodeId: 'ASP3',
        tooltip: 'Consume 100 fel to create a Crystallized Fel item which can be consumed for 100 fel.'
    }

    Demonfruit: Wc3Ability = {
        name: 'Demonfruit',
        codeId: 'A0P4',
        extCodeId: 'ASP4',
        tooltip: 'Unleash parasites onto a tree. They will mutate the tree, changing its internal structure. When cut down, Demonfruit trees will drop cursewood and demonfruit.'
    }

    TransferFel: Wc3Ability = {
        name: 'Transfer Fel',
        codeId: 'A0P5',
        extCodeId: 'ASP5',
        tooltip: 'Transfers 5 fel per second to the target.'
    }

    FelBasin: Wc3BuildingAbility = {
        name: 'Prepare Fel Basin',
        buildCodeId: 'ABP6',
        prepareCodeId: 'A0P6',
        builtUnitCodeId: 'n001',
        extCodeId: 'ASP6',
        tooltip: 'Used to store Fel. Can transfer stored fel to nearby allies.',
        materials: [
            [1, Material.Tank],
            [1, Material.Frame]
        ]
    }

    ProspectorSpellbook: Wc3Ability = {
        name: 'Basic Abilities',
        codeId: 'A0PQ',
        tooltip: 'Collection of main prospector abilities.'
    }

    // Artisan
    Transmute: Wc3Ability = {
        name: 'Transmute',
        codeId: 'A0A5',
        extCodeId: 'ASA5',
        tooltip: 'Transmutes materials'
    }

    TransmuteRock: TransmuteAbility = {
        name: 'Transmute Rock',
        codeId: 'A0A6',
        extCodeId: 'ASA6',
        matAmount: 2,
        material: Material.Wood | Material.TierI,
        tooltip: 'Transmutes 3 sticks into a rock.'
    }

    TransmuteIron: TransmuteAbility = {
        name: 'Transmute Iron',
        codeId: 'A0A7',
        extCodeId: 'ASA7',
        matAmount: 2,
        material: Material.Stone | Material.TierI,
        tooltip: 'Transmutes 3 rocks into an iron.'
    }

    TransmuteCopper: TransmuteAbility = {
        name: 'Transmute Copper',
        codeId: 'A0A8',
        extCodeId: 'ASA8',
        matAmount: 2,
        material: Material.Metal | Material.TierI,
        tooltip: 'Transmutes 3 iron into a copper.'
    }

    CrudeAxe: Wc3Ability = {
        name: 'Craft Crude Axe',
        codeId: 'A0A0',
        extCodeId: 'ASA0'
    }

    CrudePickaxe: Wc3Ability = {
        name: 'Craft Crude Pickaxe',
        codeId: 'A0A1',
        extCodeId: 'ASA1',
        tooltip: 'Summons two eyes for 60 seconds that can scout nearby land.'
    }

    Workstation: Wc3BuildingAbility = {
        name: 'Prepare Workstation',
        buildCodeId: 'ABA2',
        prepareCodeId: 'A0A2',
        builtUnitCodeId: 'h000',
        extCodeId: 'ASA2',
        tooltip: 'Building used for crafting components used in many other building recipes.',
        materials: [
            [3, Material.Stone],
            [3, Material.Wood]
        ]
    }

    HellForge: Wc3BuildingAbility = {
        name: 'Prepare Hell Forge',
        buildCodeId: 'ABA3',
        prepareCodeId: 'A0A3',
        builtUnitCodeId: 'o004',
        extCodeId: 'ASA3',
        tooltip: 'Necessary for Fel Smithing recipes.',
        materials: [
            [1, Material.Frame],
            // [1, Material.Tank],
            // [1, Material.Converter],
            [1, Material.Mechanism],
            [2, Material.Stone | Material.TierII]
        ]
    }    

    Transmuter: Wc3BuildingAbility = {
        name: 'Prepare Transmuter',
        buildCodeId: 'ABA4',
        prepareCodeId: 'A0A4',
        builtUnitCodeId: 'o003',
        extCodeId: 'ASA4',
        tooltip: 'Machine that allows allies to transmute materials.',
        materials: [
            [1, Material.Frame | Material.TierI],
            [1, Material.Converter | Material.TierI],
            [2, Material.Stone | Material.TierII],
        ]
    }

    Mineshaft: MineshaftWc3Ability = {
        name: 'Prepare Mineshaft',
        buildCodeId: 'ABA9',
        prepareCodeId: 'A0A9',
        builtUnitCodeId: 'o000',
        undergroundExitUnitCode: 'o001',
        extCodeId: 'ASA9',
        tooltip: 'Mineshaft allows players to go underground to mine ore.',
        materials: [
            [2, Material.Frame | Material.TierI],
            [2, Material.Stone | Material.TierII]
        ]
    }

    Minecart: Wc3BuildingAbility = {
        name: 'Prepare Minecart',
        buildCodeId: 'ABAA',
        prepareCodeId: 'A0AA',
        builtUnitCodeId: 'o002',
        extCodeId: 'ASAA',
        tooltip: 'Minecart can carry 6 items. They cannot move themselves, and can only follow nearby units. Click away to unfollow.',
        materials: [
            [3, Material.Metal | Material.TierI],
            [1, Material.Wood | Material.TierII]
        ]
    }

    ArtisanSpellbook: Wc3Ability = {
        name: 'Basic Abilities',
        codeId: 'A0AQ',
        tooltip: 'Collection of main artisan abilities.'
    }

    ForgeSteel: ForgeAbility = {
        name: 'Forge Steel',
        codeId: 'A0AB',
        extCodeId: 'ASAB',
        materials: [
            [3, Material.Metal | Material.TierI],
        ],
        temperature: 100,
        tooltip: 'Create a steel ingot using Hell Forge.'
    }

    ForgeFelSteel: ForgeAbility = {
        name: 'Forge Fel Steel',
        codeId: 'A0AC',
        extCodeId: 'ASAC',
        materials: [
            [3, Material.Metal | Material.TierII],
        ],
        temperature: 200,
        tooltip: 'Infuse steel with fel to create Fel Steel.'
    }

    ForgeBuildingTools: ForgeAbility = {
        name: 'Create Building Tools',
        codeId: 'A0AE',
        extCodeId: 'ASAE',
        materials: [
            [2, Material.Metal  | Material.TierII],
            [2, Material.Wood   | Material.TierII]
        ],
        temperature: 100,
        tooltip: 'Create a Building Tools. They allow to repair damaged buildings and to build walls.'
    }

    ForgeSoulGem: ForgeAbility = {
        name: 'Create Soul Gem',
        codeId: 'A0AD',
        extCodeId: 'ASAD',
        materials: [
            [1, Material.FineMetal  | Material.TierIII],
            [1, Material.Stone      | Material.TierIII],
            [1, Material.Metal      | Material.TierI],
        ],
        temperature: 300,
        tooltip: 'Create a Soul Gem. Soul Gems collect souls of fallen enemies and can be shattered. Soul Fragments are used as material for powerful machines and equipment.'
    }

    ArtisanFelsmithing: Wc3Ability = {
        name: 'Felsmithing',
        codeId: 'A0AW',
        tooltip: 'Contains Hell Forge based recipes.'
    }

    // Researcher
    Depot: Wc3BuildingAbility = {
        name: 'Prepare Depot',
        buildCodeId: 'ABR0',
        prepareCodeId: 'A0R0',
        builtUnitCodeId: 'u000',
        extCodeId: 'ASR0',
        tooltip: 'A structure that can store a large number of one type of items.',
        materials: [
            // [3, Material.Metal | Material.TierI],
            // [1, Material.Wood | Material.TierII]
        ]
    }

    
    Automaton: Wc3BuildingAbility = {
        name: 'Prepare Automaton',
        buildCodeId: 'ABR1',
        prepareCodeId: 'A0R1',
        builtUnitCodeId: 'u001',
        extCodeId: 'ASR1',
        tooltip: 'Basic worker that runs on Fel. Can be given basic orders. Upgradable with Mechanism for speed and Tank for max Fel and inventory slots.',
        materials: [
            // [3, Material.Metal | Material.TierI],
            // [1, Material.Wood | Material.TierII]
        ]
    }
    // TransmuteRock: TransmuteAbility = {
    //     name: 'Transmute Rock',
    //     codeId: 'A0A6',
    //     extCodeId: 'ASA6',
    //     matAmount: 3,
    //     material: Material.Wood | Material.TierI,
    //     tooltip: 'Transmutes 3 sticks into rock'
    // }

    // TransmuteIron: TransmuteAbility = {
    //     name: 'Transmute Iron',
    //     codeId: 'A0A7',
    //     extCodeId: 'ASA7',
    //     matAmount: 3,
    //     material: Material.Stone | Material.TierI,
    //     tooltip: 'Transmutes 3 rocks into an iron'
    // }

    // CrudeAxe: Wc3Ability = {
    //     name: 'Craft Crude Axe',
    //     codeId: 'A0A0',
    //     extCodeId: 'ASA0'
    // }

    // CrudePickaxe: Wc3Ability = {
    //     name: 'Craft Crude Pickaxe',
    //     codeId: 'A0A1',
    //     extCodeId: 'ASA1',
    //     tooltip: 'Summons two eyes for 60 seconds that can scout nearby land.'
    // }

    // Workstation: Wc3BuildingAbility = {
    //     name: 'Prepare Workstation',
    //     buildCodeId: 'ABA2',
    //     prepareCodeId: 'A0A2',
    //     builtUnitCodeId: 'h000',
    //     extCodeId: 'ASA2',
    //     tooltip: 'Creates a felstone material using 3 stones and 50 fel.'
    // }

    // HellForge: Wc3Ability = {
    //     name: 'Prepare Hell Forge',
    //     codeId: 'A0A3',
    //     extCodeId: 'ASA3',
    //     tooltip: 'Consume 100 fel to create a Crystallized Fel item which can be consumed for 100 fel.'
    // }

    // Transmuter: Wc3Ability = {
    //     name: 'Prepare Transmuter',
    //     codeId: 'A0A4',
    //     extCodeId: 'ASA4',
    //     tooltip: 'Unleash parasites onto a tree. They will mutate the tree, changing its internal structure. When cut down, Demonfruit trees will drop cursewood and demonfruit.'
    // }

    ResearcherSpellbook: Wc3Ability = {
        name: 'Basic Abilities',
        codeId: 'A0RQ',
        tooltip: 'Collection of main artisan abilities.'
    }

    // Tools

    Hand: Wc3Ability = {
        name: 'Use Your Hand',
        codeId: 'AT02'
    }

    Axe: Wc3Ability = {
        name: 'Use Axe',
        codeId: 'AT00',
        tooltip:
`Can chop down trees to get Log.

Press U to unequip.`
    }

    Pickaxe: Wc3Ability = {
        name: 'Use Pickaxe',
        codeId: 'AT01',
        tooltip:
`Can mine Stone from Stone Piles and Ore from veins.

Press U to unequip.`
    }

    TransferInventory: Wc3Ability = {
        name: 'Transfer Inventory',
        codeId: 'AT0T',
        tooltip: 
`If targeting the ground, will drop all items on that point.

Deposits existing items to target unit.
Takes items from target unit if inventory is empty (only owned or shared units).`
    }

    
//#endregion

//#region Machines
    // Artisan
    WorkstationMachine: RecipeMachineConfig = {
        workEffectPath: 'Effect_MechanicGears.mdx',
        workEffectPosition: { x: 0, y: 0, z: 250 },
        recipes: [{
            trainId: 'h003', // Upgrade Tanks
            materials: [[1, Material.Frame      | Material.TierI],
                        [1, Material.Metal      | Material.TierI]]
        }, {
            trainId: 'h004', // Upgrade Converters
            materials: [[1, Material.Frame      | Material.TierI],
                        [1, Material.FineMetal  | Material.TierI]]
        },
            
        {
            trainId: 'oPM1',
            resultId: ComponentItem.MechanismI,
            materials: [[1, Material.Metal      | Material.TierI],
                        [1, Material.FineMetal  | Material.TierI]]
        }, {
            trainId: 'oPM2',
            resultId: ComponentItem.MechanismII,
            materials: [[1, Material.Mechanism  | Material.TierI],
                        [1, Material.Metal      | Material.TierII],
                        [1, Material.FineMetal  | Material.TierII]]
        }, {
            trainId: 'oPM3',
            resultId: ComponentItem.MechanismIII,
            materials: [[1, Material.Mechanism  | Material.TierII],
                        [1, Material.Metal      | Material.TierIII],
                        [1, Material.FineMetal  | Material.TierIII]]
        }, {
            trainId: 'oPM4',
            resultId: ComponentItem.MechanismIV,
            materials: [[1, Material.Mechanism  | Material.TierIII],
                        [1, Material.Metal      | Material.TierIV],
                        [1, Material.FineMetal  | Material.TierIV]]
        },
        
        {
            trainId: 'oPF1',
            resultId: ComponentItem.FrameI,
            materials: [[1, Material.Wood       | Material.TierI],
                        [1, Material.Stone      | Material.TierI],
                        [1, Material.Metal      | Material.TierI]]
        }, {
            trainId: 'oPF2',
            resultId: ComponentItem.FrameII,
            materials: [[1, Material.Frame      | Material.TierI],
                        [1, Material.Wood       | Material.TierII],
                        [1, Material.Stone      | Material.TierII],
                        [1, Material.Metal      | Material.TierII]]
        }, {
            trainId: 'oPF3',
            resultId: ComponentItem.FrameIII,
            materials: [[1, Material.Frame      | Material.TierII],
                        [1, Material.Wood       | Material.TierIII],
                        [1, Material.Stone      | Material.TierIII],
                        [1, Material.Metal      | Material.TierIII]]
        }, {
            trainId: 'oPF4',
            resultId: ComponentItem.FrameIV,
            materials: [[1, Material.Frame      | Material.TierIII],
                        [1, Material.Wood       | Material.TierIV],
                        [1, Material.Stone      | Material.TierIV],
                        [1, Material.Metal      | Material.TierIV]]
        },
    
        {
            trainId: 'oPT1',
            resultId: ComponentItem.TankI,
            neededFel: 15,
            materials: [[1, Material.Frame      | Material.TierI],
                        [1, Material.Metal      | Material.TierI]],
        }, {
            trainId: 'oPT2',
            neededFel: 20,
            resultId: ComponentItem.TankII,
            materials: [[1, Material.Frame      | Material.TierII],
                        [1, Material.Metal      | Material.TierII]]
        }, {
            trainId: 'oPT3',
            neededFel: 25,
            resultId: ComponentItem.TankIII,
            materials: [[1, Material.Frame      | Material.TierIII],
                        [1, Material.Metal      | Material.TierIII]]
        }, {
            trainId: 'oPT4',
            neededFel: 30,
            resultId: ComponentItem.TankIV,
            materials: [[1, Material.Frame      | Material.TierIV],
                        [1, Material.Metal      | Material.TierIV]]
        },
    
        {
            trainId: 'oPC1',
            resultId: ComponentItem.ConverterI,
            materials: [[1, Material.Mechanism  | Material.TierI],
                        [1, Material.Tank       | Material.TierI]],
        }, {
            trainId: 'oPC2',
            resultId: ComponentItem.ConverterII,
            materials: [[1, Material.Mechanism  | Material.TierII],
                        [1, Material.Tank       | Material.TierII]]
        }, {
            trainId: 'oPC3',
            resultId: ComponentItem.ConverterIII,
            materials: [[1, Material.Mechanism  | Material.TierIII],
                        [1, Material.Tank       | Material.TierIII]]
        }, {
            trainId: 'oPC4',
            resultId: ComponentItem.ConverterIV,
            materials: [[1, Material.Mechanism  | Material.TierIV],
                        [1, Material.Tank       | Material.TierIV]]
        }]
    }

    TransmuterMachine: RecipeMachineConfig = {
        workEffectPath: 'Effect_MechanicGears.mdx',
        workEffectPosition: { x: 0, y: 0, z: 250 },
        recipes: [{
            trainId: 'oMS1',
            resultId: ResourceItem.Rock,
            materials: [[2, Material.Wood       | Material.TierI]]
        }, {
            trainId: 'oMM1',
            resultId: ResourceItem.Iron,
            materials: [[2, Material.Stone      | Material.TierI]]
        }, {
            trainId: 'oMF1',
            resultId: ResourceItem.Copper,
            materials: [[2, Material.Metal      | Material.TierI]]
        }]
    }

    ForgeRaiseTemperature: Wc3ToggleAbility = {
        name: 'Not Raising',
        codeId: 'A00D',
        tooltip: 'Start the flames in the forge. This consumes Fel each second and raises its temperature. Hell forge recipes have a temperature requirement to meet.',
        nameOn: 'Raising Temperature',
        tooltipOn: 'Hell Forge is consuming fel rapidly to increase its temperature.'
    }

    ForgeMaintainTemperature: Wc3ToggleAbility = {
        name: 'Not Maintaining',
        codeId: 'A00H',
        tooltip: 'Not maintaining the flames. The flames will grow weaker and temperature will drop until the fire dies down.',
        nameOn: 'Maintaining Temperature',
        tooltipOn: 'Maintaining the flames in the forge. Consuming only 1/3 of the fel cost, but the temperature will fluctuate.'
    }

//#endregion

    items: ItemConfig[] = [{
            name: 'Branch',
            itemTypeId: ResourceItem.Branch,
            tooltip: 'Simple piece of wood.',
            material: Material.Wood | Material.TierI
        }, {
            name: 'Log',
            itemTypeId: ResourceItem.Log,
            tooltip: 'A large piece of wood.',
            material: Material.Wood | Material.TierII
        },
        
        {
            name: 'Rock',
            itemTypeId: ResourceItem.Rock,
            tooltip: 'A simple rock.',
            material: Material.Stone | Material.TierI
        }, {
            name: 'Stone',
            itemTypeId: ResourceItem.Stone,
            tooltip: 'A carved piece of stone.',
            material: Material.Stone | Material.TierII
        }, {
            name: 'Felstone',
            itemTypeId: ResourceItem.Felstone,
            tooltip: 'Fel infused piece of stone.',
            material: Material.Stone | Material.TierIII
        }, 

        {
            name: 'Iron',
            itemTypeId: ResourceItem.Iron,
            tooltip: 'Sturdy ore.',
            material: Material.Metal | Material.TierI
        }, {
            name: 'Steel',
            itemTypeId: ResourceItem.Steel,
            tooltip: 'A refined metal ingot.',
            material: Material.Metal | Material.TierII
        }, {
            name: 'Fel Steel',
            itemTypeId: ResourceItem.FelSteel,
            tooltip: 'Refined and fel-infused metal ingot.',
            material: Material.Metal | Material.TierIII
        }, 
        
        {
            name: 'Copper',
            itemTypeId: ResourceItem.Copper,
            tooltip: 'Reddish ore.',
            material: Material.FineMetal | Material.TierI
        }, {
            name: 'Silver',
            itemTypeId: ResourceItem.Silver,
            tooltip: 'Shiny metal ore.',
            material: Material.FineMetal | Material.TierII
        }, {
            name: 'Gold',
            itemTypeId: ResourceItem.Gold,
            tooltip: 'Precious.',
            material: Material.FineMetal | Material.TierIII
        },
        
        {
            name: 'Mechanism I',
            itemTypeId: ComponentItem.MechanismI,
            tooltip: 'Component part.',
            material: Material.Mechanism | Material.TierI
        }, {
            name: 'Mechanism II',
            itemTypeId: ComponentItem.MechanismII,
            tooltip: 'Component part.',
            material: Material.Mechanism | Material.TierII
        }, {
            name: 'Mechanism III',
            itemTypeId: ComponentItem.MechanismIII,
            tooltip: 'Component part.',
            material: Material.Mechanism | Material.TierIII
        }, {
            name: 'Mechanism IV',
            itemTypeId: ComponentItem.MechanismIV,
            tooltip: 'Component part.',
            material: Material.Mechanism | Material.TierIV
        },
        
        {
            name: 'Frame I',
            itemTypeId: ComponentItem.FrameI,
            tooltip: 'Component part.',
            material: Material.Frame | Material.TierI
        }, {
            name: 'Frame II',
            itemTypeId: ComponentItem.FrameII,
            tooltip: 'Component part.',
            material: Material.Frame | Material.TierII
        }, {
            name: 'Frame III',
            itemTypeId: ComponentItem.FrameIII,
            tooltip: 'Component part.',
            material: Material.Frame | Material.TierIII
        }, {
            name: 'Frame IV',
            itemTypeId: ComponentItem.FrameIV,
            tooltip: 'Component part.',
            material: Material.Frame | Material.TierIV
        },
        
        {
            name: 'Tank I',
            itemTypeId: ComponentItem.TankI,
            tooltip: 'Component part.',
            material: Material.Tank | Material.TierI
        }, {
            name: 'Tank II',
            itemTypeId: ComponentItem.TankII,
            tooltip: 'Component part.',
            material: Material.Tank | Material.TierII
        }, {
            name: 'Tank III',
            itemTypeId: ComponentItem.TankIII,
            tooltip: 'Component part.',
            material: Material.Tank | Material.TierIII
        }, {
            name: 'Tank IV',
            itemTypeId: ComponentItem.TankIV,
            tooltip: 'Component part.',
            material: Material.Tank | Material.TierIV
        }, 

        {
            name: 'Converter I',
            itemTypeId: ComponentItem.ConverterI,
            tooltip: 'Component part.',
            material: Material.Converter | Material.TierI
        }, {
            name: 'Converter II',
            itemTypeId: ComponentItem.ConverterII,
            tooltip: 'Component part.',
            material: Material.Converter | Material.TierII
        }, {
            name: 'Converter III',
            itemTypeId: ComponentItem.ConverterIII,
            tooltip: 'Component part.',
            material: Material.Converter | Material.TierIII
        }, {
            name: 'Converter IV',
            itemTypeId: ComponentItem.ConverterIV,
            tooltip: 'Component part.',
            material: Material.Converter | Material.TierIV
        }, 

        {
            name: 'Crystallized Fel',
            itemTypeId: FourCC('I003'),
            tooltip: 'A chunk of fel, can be consumed for 100 fel.'
        }
    ]
}