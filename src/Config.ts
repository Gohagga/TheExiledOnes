import { TransmuteAbility } from "content/abilities/artisan/Transmute"
import { ComponentItem, ResourceItem } from "content/items/ResourceItem"
import { Wc3BuildingAbility } from "systems/abilities/BuildingAbilityBase"
import { Wc3Ability } from "systems/abilities/Wc3Ability"
import { RecipeMachineConfig } from "systems/crafting/machine/MachineConfig"
import { Material } from "systems/crafting/Material"
import { ItemConfig } from "systems/items/ItemConfig"
import { MapPlayer } from "w3ts/index"

export const SharedPlayer = MapPlayer.fromIndex(20);

export class Config {

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

    InfuseFelstone: Wc3Ability = {
        name: 'Infuse Felstone',
        codeId: 'A0P2',
        extCodeId: 'ASP2',
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
        tooltip: 'Transfers 20 fel per second to the target.'
    }

    PrepareFelCollector: Wc3Ability = {
        name: 'Prepare Fel Collector',
        codeId: 'A0P6',
        extCodeId: 'ASP6',
        tooltip: 'A building that slowly gathers fel emitted by nearby Demonfruits. Can transfer its fel to a nearby ally.'
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
        matAmount: 3,
        material: Material.Wood | Material.TierI,
        tooltip: 'Transmutes 3 sticks into rock'
    }

    TransmuteIron: TransmuteAbility = {
        name: 'Transmute Iron',
        codeId: 'A0A7',
        extCodeId: 'ASA7',
        matAmount: 3,
        material: Material.Stone | Material.TierI,
        tooltip: 'Transmutes 3 rocks into an iron'
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
        extCodeId: 'ASA2',
        tooltip: 'Creates a felstone material using 3 stones and 50 fel.'
    }

    HellForge: Wc3Ability = {
        name: 'Prepare Hell Forge',
        codeId: 'A0A3',
        extCodeId: 'ASA3',
        tooltip: 'Consume 100 fel to create a Crystallized Fel item which can be consumed for 100 fel.'
    }

    Transmuter: Wc3Ability = {
        name: 'Prepare Transmuter',
        codeId: 'A0A4',
        extCodeId: 'ASA4',
        tooltip: 'Unleash parasites onto a tree. They will mutate the tree, changing its internal structure. When cut down, Demonfruit trees will drop cursewood and demonfruit.'
    }

    ArtisanSpellbook: Wc3Ability = {
        name: 'Basic Abilities',
        codeId: 'A0AQ',
        tooltip: 'Collection of main artisan abilities.'
    }

    // Tools

    Axe: Wc3Ability = {
        name: 'Use Axe',
        codeId: 'AT00',
        tooltip: 'Chop down trees and stuff'
    }

    Pickaxe: Wc3Ability = {
        name: 'Use Pickaxe',
        codeId: 'AT01',
        tooltip: 'Pick rocks and stuff'
    }

    TransferInventory: Wc3Ability = {
        name: 'Transfer Inventory',
        codeId: 'AT0T',
        tooltip: 
`If targeting the ground, will drop all items on that point.

Deposits existing items to target unit.
Takes items from target unit if inventory is empty.`
    }

    
//#endregion

//#region Machines
    // Artisan
    WorkstationMachine: RecipeMachineConfig = {
        workEffectPath: 'Effect_MechanicGears.mdx',
        workEffectPosition: { x: 0, y: 0, z: 250 },
        recipes: [{
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
        }]
    }

//#endregion

    items: ItemConfig[] = [
        
        // {
        //     name: 'Branch',
        //     itemTypeId: ResourceItem.WoodI,
        //     tooltip: 'Simple piece of wood.',
        //     material: Material.Wood | Material.TierI
        // }, {
        //     name: 'Rock',
        //     itemTypeId: ResourceItem.StoneI,
        //     tooltip: 'Simple rock.',
        //     material: Material.Mechanism | Material.TierII
        // }, {
        //     name: 'Iron',
        //     itemTypeId: ResourceItem.MechanismIII,
        //     tooltip: 'Sturdy ore.',
        //     material: Material.Mechanism | Material.TierIII
        // }, {
        //     name: 'Copper',
        //     itemTypeId: ResourceItem.MechanismIV,
        //     tooltip: 'Component part.',
        //     material: Material.Mechanism | Material.TierIV
        // }, 
        
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
    ]
}