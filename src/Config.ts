import { TransmuteAbility } from "content/abilities/artisan/Transmute"
import { Wc3BuildingAbility } from "systems/abilities/BuildingAbilityBase"
import { Wc3Ability } from "systems/abilities/Wc3Ability"
import { Material } from "systems/crafting/Material"

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

//#endregion
}