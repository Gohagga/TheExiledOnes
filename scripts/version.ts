import * as fs from "fs-extra";
import * as path from "path";
import War3Map from "mdx-m3-viewer/src/parsers/w3x/map";
import War3MapW3i from "mdx-m3-viewer/src/parsers/w3x/w3i/file";
import { IProjectConfig, loadJsonFile } from "./utils";
import War3MapWts from "mdx-m3-viewer/src/parsers/w3x/wts/file";

const config: IProjectConfig = loadJsonFile("config.json");
setVersionAuthor(config);


export function setVersionAuthor(config: IProjectConfig) {

    let mapInfo = config.mapInfo;
    let path = `./dist/${config.mapFolder}`;

    let buffer = fs.readFileSync(`${path}/war3map.w3i`);
    
    let w3i = new War3MapW3i();
    w3i.load(buffer);

    let wts = new War3MapWts();
    wts.load(fs.readFileSync(`${path}/war3map.wts`).toString());

    let strings = wts.stringMap;

    // w3i.
    wts.stringMap.set(getStrIndex(w3i.name), mapInfo.name);
    wts.stringMap.set(getStrIndex(w3i.author), mapInfo.author);
    wts.stringMap.set(getStrIndex(w3i.description), mapInfo.description);
    wts.stringMap.set(getStrIndex(w3i.recommendedPlayers), mapInfo.recommendedPlayers);

    w3i.loadingScreenTitle = mapInfo.loadingScreenTitle.replace('{version}', config.version);
    w3i.loadingScreenSubtitle = mapInfo.loadingScreenSubtitle;
    w3i.loadingScreenText = mapInfo.loadingScreenDescription;

    // console.log(wts.stringMap);
  
    // console.log(w3i);

    fs.existsSync(`${path}/war3map.w3i`);

    fs.writeFile(`${path}/war3map.w3i`, w3i.save(), (err) => console.log(err));
    fs.writeFile(`${path}/war3map.wts`, wts.save(), (err) => console.log(err));
}


function getStrIndex(name: string) {

    let index = parseInt(name.slice(8));
    return index;
}