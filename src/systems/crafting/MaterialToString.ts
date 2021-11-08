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

let woodColor = new Color(183, 130, 81).code;
let woodString = woodColor + 'Wood|r';
let stoneColor = new Color(200, 200, 200).code;
let stoneString = stoneColor + 'Stone|r';
let metalColor = new Color(125, 125, 170).code;
let metalString = metalColor + 'Metal|r';
let fineMetalColor = new Color(125, 202, 194).code;
let fineMetalString = fineMetalColor + 'Fine Metal|r';
let animalColor = new Color(250, 177, 221).code;
let animalString = animalColor + 'Animal|r';
let organicMatterColor = new Color(113, 82, 171).code;
let organicMatterString = organicMatterColor + 'Organic Matter|r';

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

export function MaterialName(material: Material, itemTypeId?: number) {

    let name = '';
    if (Material.Wood       == (Material.Wood & material) && Material.TierI         == (Material.TierI & material))     name += ' ' + 'Branch';
    if (Material.Wood       == (Material.Wood & material) && Material.TierII        == (Material.TierII & material))    name += ' ' + 'Log';
    if (Material.Wood       == (Material.Wood & material) && Material.TierIII       == (Material.TierIII & material))   name += ' ' + 'Felwood';
    if (Material.Wood       == (Material.Wood & material) && Material.TierIV        == (Material.TierIV & material))    name += ' ' + 'Cursewood';

    if (Material.Stone       == (Material.Stone & material) && Material.TierI       == (Material.TierI & material))     name += ' ' + 'Rock';
    if (Material.Stone       == (Material.Stone & material) && Material.TierII      == (Material.TierII & material))    name += ' ' + 'Stone';
    if (Material.Stone       == (Material.Stone & material) && Material.TierIII     == (Material.TierIII & material))   name += ' ' + 'Felstone';
    if (Material.Stone       == (Material.Stone & material) && Material.TierIV      == (Material.TierIV & material))    name += ' ' + 'Cursed Stone';
    
    if (Material.Metal       == (Material.Metal & material) && Material.TierI       == (Material.TierI & material))     name += ' ' + 'Iron';
    if (Material.Metal       == (Material.Metal & material) && Material.TierII      == (Material.TierII & material))    name += ' ' + 'Steel';
    if (Material.Metal       == (Material.Metal & material) && Material.TierIII     == (Material.TierIII & material))   name += ' ' + 'Felsteel';
    if (Material.Metal       == (Material.Metal & material) && Material.TierIV      == (Material.TierIV & material))    name += ' ' + 'Soulsteel';

    if (Material.FineMetal   == (Material.FineMetal & material) && Material.TierI   == (Material.TierI & material))     name += ' ' + 'Copper';
    if (Material.FineMetal   == (Material.FineMetal & material) && Material.TierII  == (Material.TierII & material))    name += ' ' + 'Silver';
    if (Material.FineMetal   == (Material.FineMetal & material) && Material.TierIII == (Material.TierIII & material))   name += ' ' + 'Gold';
    if (Material.FineMetal   == (Material.FineMetal & material) && Material.TierIV  == (Material.TierIV & material))    name += ' ' + 'Cursed Electrum';

    if (name == '') {

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
    }
    

    return name.trim();
}

export function ColoredMaterialName(material: Material, itemTypeId?: number) {

    let name = '';
    if (Material.Wood       == (Material.Wood & material) && Material.TierI         == (Material.TierI & material))     name += ' ' + woodColor         + 'Branch' + '|r';
    if (Material.Wood       == (Material.Wood & material) && Material.TierII        == (Material.TierII & material))    name += ' ' + woodColor         + 'Log' + '|r';
    if (Material.Wood       == (Material.Wood & material) && Material.TierIII       == (Material.TierIII & material))   name += ' ' + woodColor         + 'Felwood' + '|r';
    if (Material.Wood       == (Material.Wood & material) && Material.TierIV        == (Material.TierIV & material))    name += ' ' + woodColor         + 'Cursewood' + '|r';

    if (Material.Stone       == (Material.Stone & material) && Material.TierI       == (Material.TierI & material))     name += ' ' + stoneColor        + 'Rock' + '|r';
    if (Material.Stone       == (Material.Stone & material) && Material.TierII      == (Material.TierII & material))    name += ' ' + stoneColor        + 'Stone' + '|r';
    if (Material.Stone       == (Material.Stone & material) && Material.TierIII     == (Material.TierIII & material))   name += ' ' + stoneColor        + 'Felstone' + '|r';
    if (Material.Stone       == (Material.Stone & material) && Material.TierIV      == (Material.TierIV & material))    name += ' ' + stoneColor        + 'Cursed Stone' + '|r';
    
    if (Material.Metal       == (Material.Metal & material) && Material.TierI       == (Material.TierI & material))     name += ' ' + metalColor        + 'Iron' + '|r';
    if (Material.Metal       == (Material.Metal & material) && Material.TierII      == (Material.TierII & material))    name += ' ' + metalColor        + 'Steel' + '|r';
    if (Material.Metal       == (Material.Metal & material) && Material.TierIII     == (Material.TierIII & material))   name += ' ' + metalColor        + 'Felsteel' + '|r';
    if (Material.Metal       == (Material.Metal & material) && Material.TierIV      == (Material.TierIV & material))    name += ' ' + metalColor        + 'Soulsteel' + '|r';

    if (Material.FineMetal   == (Material.FineMetal & material) && Material.TierI   == (Material.TierI & material))     name += ' ' + fineMetalColor    + 'Copper' + '|r';
    if (Material.FineMetal   == (Material.FineMetal & material) && Material.TierII  == (Material.TierII & material))    name += ' ' + fineMetalColor    + 'Silver' + '|r';
    if (Material.FineMetal   == (Material.FineMetal & material) && Material.TierIII == (Material.TierIII & material))   name += ' ' + fineMetalColor    + 'Gold' + '|r';
    if (Material.FineMetal   == (Material.FineMetal & material) && Material.TierIV  == (Material.TierIV & material))    name += ' ' + fineMetalColor    + 'Cursed Electrum' + '|r';

    if (name == '') {

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
    }

    return name.trim();
}