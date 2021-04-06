import * as fs from "fs-extra";
import * as path from "path";
import War3Map from "mdx-m3-viewer/src/parsers/w3x/map";
import War3MapW3i from "mdx-m3-viewer/src/parsers/w3x/w3i/file";
import { compileMap, getFilesInDirectory, loadJsonFile, logger, toArrayBuffer, IProjectConfig, saveJsonFile } from "./utils";

function main() {
  const config: IProjectConfig = loadJsonFile("config.json");
  const result = compileMap(config);
  
  let v = config.version;
  const version = `v${v.major}.${v.minor}.${++v.build}`;

  if (!result) {
    logger.error(`Failed to compile map.`);
    return;
  }

  logger.info(`Creating w3x archive...`);
  if (!fs.existsSync(config.outputFolder)) {
    fs.mkdirSync(config.outputFolder);
  }

  let mapFileName = config.mapFolder.replace('.w3x', '_' + version + '.w3x');

  createMapFromDir(`${config.archiveOutputFolder}/${mapFileName}`, `./dist/${config.mapFolder}`);
  saveJsonFile("config.json", config);
}

/**
 * Creates a w3x archive from a directory
 * @param output The output filename
 * @param dir The directory to create the archive from
 */
export function createMapFromDir(output: string, dir: string) {
  const map = new War3Map();
  const files = getFilesInDirectory(dir);

  map.archive.resizeHashtable(files.length);

  for (const fileName of files) {
    const contents = toArrayBuffer(fs.readFileSync(fileName));
    const archivePath = path.relative(dir, fileName);
    const imported = map.import(archivePath, contents);

    if (!imported) {
      logger.warn("Failed to import " + archivePath);
      continue;
    }
  }

  const result = map.save();

  if (!result) {
    logger.error("Failed to save archive.");
    return;
  }

  fs.writeFileSync(output, new Uint8Array(result));

  logger.info("Finished!");
}

main();