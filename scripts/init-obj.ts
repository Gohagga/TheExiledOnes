// import War3Map from "mdx-m3-viewer/src/parsers/w3x/map";
import BinaryStream from "mdx-m3-viewer/src/common/binarystream";
import War3MapW3d from "mdx-m3-viewer/src/parsers/w3x/w3d/file";
import W3o from "mdx-m3-viewer/src/parsers/w3x/w3o/file";
import * as path from 'path';
import * as fs from 'fs-extra';
import War3MapW3u from "mdx-m3-viewer/src/parsers/w3x/w3u/file";

const mapPath = path.join(__dirname, '..', 'dist/map.w3x/war3map.w3a');
console.log(mapPath);
let buffer = fs.readFileSync(mapPath);
// let stream = new BinaryStream(buffer);

let abilities = new War3MapW3d();
abilities.load(buffer);

console.log(JSON.stringify(abilities.customTable.objects));

// War3MapW3o