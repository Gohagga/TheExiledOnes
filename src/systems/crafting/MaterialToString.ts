import { Log } from "Log";
import { Color } from "w3ts/index";
import { Material } from "./Material";

export function MaterialToString(material: Material, itemTypeId?: number) {

    let name = '';
    if (Material.FelExtraction == (Material.FelExtraction & material))    name += ' Extractable';
    
    if (Material.Wood       == (Material.Wood & material))      name += ' Wood'
    if (Material.Stone      == (Material.Stone & material))     name += ' Stone'
    if (Material.Metal      == (Material.Metal & material))     name += ' Metal'
    if (Material.FineMetal  == (Material.FineMetal & material)) name += ' Fine Metal'

    if (Material.Mechanism  == (Material.Mechanism & material)) name += ' Mechanism'
    if (Material.Frame      == (Material.Frame & material))     name += ' Frame'
    if (Material.Tank       == (Material.Tank & material))      name += ' Tank'
    if (Material.Converter  == (Material.Converter & material)) name += ' Converter'
    if (Material.Resonator  == (Material.Resonator & material)) name += ' Resonator'
    
    if (Material.TierI      == (Material.TierI & material))     name += ' I'
    if (Material.TierII     == (Material.TierII & material))    name += ' II'
    if (Material.TierIII    == (Material.TierIII & material))   name += ' III'
    if (Material.TierIV     == (Material.TierIV & material))    name += ' IV'

    if (Material.Animal     == (Material.Animal & material))    name += ' Animal';
    if (Material.OrganicMatter == (Material.OrganicMatter & material))    name += ' Organic Matter';

    if (material == Material.Unique && itemTypeId) name += ' ' + GetObjectName(itemTypeId);

    return name.trim();
}

let woodString = new Color(183, 130, 81).code + 'Wood|r';
let stoneString = new Color(200, 200, 200).code + 'Stone|r';
let metalString = new Color(125, 125, 170).code + 'Metal|r';
let fineMetalString = new Color(125, 202, 194).code + 'Fine Metal|r';
let animalString = new Color(250, 177, 221).code + 'Animal|r';
let organicMatterString = new Color(113, 82, 171).code + 'Organic Matter|r';
export function MaterialToColoredString(material: Material, itemTypeId?: number) {

    let name = '';
    if (Material.Wood       == (Material.Wood & material))      name += ' ' + woodString;
    if (Material.Stone      == (Material.Stone & material))     name += ' ' + stoneString;
    if (Material.Metal      == (Material.Metal & material))     name += ' ' + metalString;
    if (Material.FineMetal  == (Material.FineMetal & material)) name += ' ' + fineMetalString;

    if (Material.Mechanism  == (Material.Mechanism & material)) name += ' Mechanism'
    if (Material.Frame      == (Material.Frame & material))     name += ' Frame'
    if (Material.Tank       == (Material.Tank & material))      name += ' Tank'
    if (Material.Converter  == (Material.Converter & material)) name += ' Converter'
    if (Material.Resonator  == (Material.Resonator & material)) name += ' Resonator'
    
    if (Material.TierI      == (Material.TierI & material))     name += ' I'
    if (Material.TierII     == (Material.TierII & material))    name += ' II'
    if (Material.TierIII    == (Material.TierIII & material))   name += ' III'
    if (Material.TierIV     == (Material.TierIV & material))    name += ' IV'

    if (Material.Animal     == (Material.Animal & material))    name += ' ' + animalString;
    if (Material.OrganicMatter == (Material.OrganicMatter & material))    name += ' ' + organicMatterString;

    if (material == Material.Unique && itemTypeId) name += ' ' + GetObjectName(itemTypeId);
    

    return name.trim();
}