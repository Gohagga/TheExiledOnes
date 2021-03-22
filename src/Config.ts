import { Wc3Ability } from "systems/abilities/Wc3Ability"

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

//#endregion
}