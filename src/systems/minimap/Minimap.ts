import { Log } from "Log";
import { Frame, Rectangle } from "w3ts/index";

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

    // private readonly widthCells: number;
    // private readonly heightCells: number;

    constructor(
        private readonly mapBounds: Rectangle
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
    }

    setPoint(x: number, y: number, color: number) {

        // Log.Info(x, y, x - this.minX, y - this.minY);
        
        let mapX = math.floor((x - this.minX) / 128);
        let mapY = math.floor((y - this.minY) / 128);
        
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



    experimental() {
        print("started");
        Log.ResetStep(0);
        try {
            
            const minimapO = Frame.fromOrigin(ORIGIN_FRAME_MINIMAP, 0);
            const minimap = minimapO.handle;
            // BlzFrameSetVisible(minimap, false);
            const width = BlzFrameGetWidth(minimap) / 64;
            const height = BlzFrameGetHeight(minimap) / 64;

            let childrenCount = minimapO.childrenCount;
            Log.Info("Children count: ", childrenCount);

            for (let i = 0; i < childrenCount; i++) {
                let child = minimapO.getChild(i);
                Log.Info("Child", i, "name", BlzFrameGetName(child.handle));
            }
            minimapO.setAlpha(0);
            
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
    
            // SetCameraBoundsToRect(this.mapBounds.handle);
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
                    BlzFrameSetTexture(pixel, 'Pixel', 0, true)
                    BlzFrameSetVertexColor(pixel, BlzConvertColor(255, x * 4, y * 4, 255));
                }
            }
        } catch (ex) {
            Log.Error(ex);
        }
    }
}