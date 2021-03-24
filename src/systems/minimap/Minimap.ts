import { Log } from "Log";
import { IHeightNoiseProvider } from "systems/map-generation/interfaces/IHeightNoiseProvider";
import { TerrainType } from "systems/map-generation/MapGenerator";
import { Frame, MapPlayer, Rectangle, Trigger } from "w3ts/index";

export class Minimap {

    private minX: number;
    private minY: number;
    private width: number;
    private height: number;

    private readonly mapX: number = 0.05;
    private readonly mapY: number = 0.05;
    private pixWidth: number = 0;
    private pixHeight: number = 0;

    private minimapSize: number = 0.18;

    private mapPixFrames: framehandle[] = [];
    private pixTexture: string = '2Pixel.dds';

    // private readonly widthCells: number;
    // private readonly heightCells: number;

    constructor(
        private readonly mapBounds: Rectangle,
        private readonly heightProvider: IHeightNoiseProvider,
    ) {
        this.minX = mapBounds.minX;
        this.minY = mapBounds.minY;
        this.width = mapBounds.maxX - mapBounds.minX;
        this.height = mapBounds.maxY - mapBounds.minY;

        // Log.Info("actual map bounds", this.width, this.height);

        // this.widthCells = this.width / 128;

        // Log.Info("cell width", this.widthCells);
        // this.heightCells = this.widthCells;
        // this.pixelSize = this.minimapSize / this.widthCells;
        // Log.Info("pixel size", this.pixelSize);

        // const minimap = BlzGetOriginFrame(ORIGIN_FRAME_MINIMAP, 0);
        // BlzFrameSetVisible(minimap, false);

        this.experimental();

        let t = new Trigger();
        t.registerPlayerChatEvent(MapPlayer.fromIndex(0), "-minimap", true);
        t.addAction(() => this.regenerateMinimap(mapBounds, heightProvider));

        t = new Trigger();
        t.registerPlayerChatEvent(MapPlayer.fromIndex(0), "-recreate", true);
        t.addAction(() => {
            Log.Info("Recreate");
            if (this.pixTexture == '2Pixel.dds') this.pixTexture = 'Textures\\Lords0000.blp';
            else this.pixTexture = '2Pixel.dds';
            // SetCameraBoundsToRect(this.mapBounds.handle);
            
            Log.Info("pixels", this.mapPixFrames.length);
            this.experimental();
            // const minimapO = Frame.fromOrigin(ORIGIN_FRAME_MINIMAP, 0);
            // minimapO.setAlpha(0);
        });
    }

    setPoint(x: number, y: number, color: number) {

        // Log.Info(x, y, x - this.minX, y - this.minY);

        let mapX = math.floor(64 * (x - this.minX) / this.width + 0.5);
        let mapY = math.floor(64 * (y - this.minY) / this.height + 0.5);
        
        // let name = "Pix_" + mapX + "_" + mapY;
        // const pixel = BlzGetFrameByName(name, 0);
        const pixel = this.mapPixFrames[mapX + mapY * 64];

        BlzFrameSetVertexColor(pixel, color);
        // // Log.Info("Set point", mapX, mapY);

        // let pix = this.createPixel(mapX, mapY);
        // pix.setVertexColor(color);
    }

    private createPixel(x: number, y: number) {
        // let tex = 'Textures\Lords0000.blp';

        // let gameUi = Frame.fromOrigin(ORIGIN_FRAME_GAME_UI, 0);
        // const highlight = Frame.fromHandle(BlzCreateFrameByType("BACKDROP", "AvailableImage", gameUi.handle, "", 0));

        // highlight
        //     .clearPoints()
        //     .setAbsPoint(FRAMEPOINT_BOTTOMLEFT, x, y)
        //     .setSize(this.pixelSize, this.pixelSize)
        //     .setTexture(tex, 0, true);

        // return highlight;
    }

    public updateMinimap(rect: Rectangle, heightFunc: (x: number, y: number) => number) {

        let xStep = (rect.maxX - rect.minX) * 0.015625;
        let yStep = (rect.maxY - rect.minY) * 0.015625;

        let color = -1;

        for (let y = 0; y < 64; y++) {
            for (let x = 0; x < 64; x++) {

                let mapX = x * xStep + rect.minX;
                let mapY = y * yStep + rect.minY;

                let height = heightFunc(mapX, mapY);
                let terrainType = GetTerrainType(mapX, mapY);

                if (height <= 0) {
                    color = BlzConvertColor(255, 0, 157, 225);
                } else if (terrainType == TerrainType.Dirt) {
                    color = BlzConvertColor(255, 145, 104, 60);
                } else if (terrainType == TerrainType.Grass) {
                    color = BlzConvertColor(255, 44, 108, 27);
                } else if (terrainType == TerrainType.Dirt) {
                    color = BlzConvertColor(255, 27, 89, 19);
                } else if (terrainType == TerrainType.Dirt) {
                    color = BlzConvertColor(255, 126, 91, 52);
                }

                const pixel = this.mapPixFrames[x + y * 64];
                BlzFrameSetVertexColor(pixel, color);
            }
        }
    }

    public regenerateMinimap(rect: Rectangle, heightProvider: IHeightNoiseProvider) {

        Log.Info("Regenerating minimap.");
        // Generate Surface
        const { maxX, maxY } = rect;
        const { minX, minY } = rect;
        const maxProgress = (-minX + maxX) * (-minY + maxY);

        // Generate pathing
        for (let y = minY; y < maxY; y += 16) {
            
            let ny = y / maxY;
            for (let x = minX; x < maxX; x += 16) {

                let nx = x / maxX;
                let height = 2750 * heightProvider.getHeightValue(nx, ny) + 64;

                if (height > 100) {

                    if (height >= 160) {
                        let darkness = height / 700;
                        if (darkness < 0) darkness = 0.1;
                        else if (darkness > 1) darkness = 1;

                        let grey = math.floor(150 - 150*darkness);
                        let col = BlzConvertColor(255, 5+grey, grey, grey);
                        this.setPoint(x, y, col);
                    }
                } else if (height > 0) {
                    this.setPoint(x, y, BlzConvertColor(255, 166, 192, 137));
                } else {
                    this.setPoint(x, y, BlzConvertColor(255, 0, 157, 225));
                }
            }
            
        }
    }

    experimental() {
        try {
            // BlzChangeMinimapTerrainTex('war3mapImported\\transparent.blp');
            SetCameraBoundsToRect(this.mapBounds.handle);
            
            const minimapO = Frame.fromOrigin(ORIGIN_FRAME_MINIMAP, 0);
            const minimap = minimapO.handle;
            minimapO.setAlpha(0);

            // BlzFrameSetVisible(minimap, false);
            const width = BlzFrameGetWidth(minimap) / 64;
            const height = BlzFrameGetHeight(minimap) / 64;

            // let childrenCount = minimapO.childrenCount;
            // Log.Info("Children count: ", childrenCount);

            // for (let i = 0; i < childrenCount; i++) {
            //     let child = minimapO.getChild(i);
            //     Log.Info("Child", i, "name", BlzFrameGetName(child.handle));
            // }
            let c = BlzConvertColor(0, 255, 0, 0);
            // child0.setVertexColor(c)
            // minimapO.setVertexColor(c);
            
            this.pixWidth = width;
            this.pixHeight = height;

            // SetCameraBoundsToRectForPlayerBJ
    
            Log.Step();
            print(BlzLoadTOCFile('MapPixel.toc'))
            Log.Step();
            let customMinimap = BlzCreateSimpleFrame("CustomMinimap", BlzGetFrameByName("ConsoleUI", 0), 0);
            // let mini = BlzCreateSimpleFrame("CustomMinimap", BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0);
            BlzFrameSetPoint(customMinimap, FRAMEPOINT_BOTTOMLEFT, minimap, FRAMEPOINT_BOTTOMLEFT, 0, 0);
            BlzFrameSetPoint(customMinimap, FRAMEPOINT_TOPRIGHT, minimap, FRAMEPOINT_TOPRIGHT, 0, 0);

            print("height", height, "width", width);

            // BlzFrameSetPoint(mini, FRAMEPOINT_BOTTOMLEFT, minimap, FRAMEPOINT_BOTTOMLEFT, 0, 0);
    
            const widthFuzz = 0.01 * width;
            const heightFuzz = 0.01 * height;
            let count = 0;
            for (let x = 0; x < 64; x++) {
                for (let y = 0; y < 64; y++) {
    
                    let name = "Pix_" + x + "_" + y;
                    const pixel = BlzGetFrameByName(name, 0);
                    this.mapPixFrames[x + 64 * y] = pixel;
                    // if (GetHandleId(pixel) == 0)
                    //     continue;
                    
                    // print(count++, GetHandleId(pixel), GetHandleId(pixel), name);
                    
                    BlzFrameClearAllPoints(pixel);
                    BlzFrameSetSize(pixel, width + widthFuzz, height + heightFuzz)
                    BlzFrameSetPoint(pixel, FRAMEPOINT_BOTTOMLEFT, customMinimap, FRAMEPOINT_BOTTOMLEFT, x * width, y * height);
                    BlzFrameSetTexture(pixel, this.pixTexture, 0, true)
                    // BlzFrameSetVertexColor(pixel, BlzConvertColor(255, x * 4, y * 4, 255));
                    BlzFrameSetVertexColor(pixel, BlzConvertColor(255, 145, 104, 60));
                }
            }
        } catch (ex) {
            Log.Error(ex);
        }
        Log.Info("Finished creating minimap.");
    }
}