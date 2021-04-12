import { Color } from "w3ts/index";
import { Material } from "./Material";

export function MaterialToString(material: Material) {

    let name = '';
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

    return name.trim();
}

let woodString = new Color(183, 130, 81).code + 'Wood|r';
let stoneString = new Color(200, 200, 200).code + 'Stone|r';
let metalString = new Color(125, 125, 170).code + 'Metal|r';
let fineMetalString = new Color(125, 202, 194).code + 'Fine Metal|r';
export function MaterialToColoredString(material: Material) {

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

    return name.trim();
}