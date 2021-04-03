import { Log } from "Log";
import { IHeightNoiseProvider } from "systems/map-generation/interfaces/IHeightNoiseProvider";
import { Frame, MapPlayer, Rectangle, Timer, Trigger } from "w3ts/index";
import { IMinimap } from "./IMinimap";

export class CustomMinimap2 implements IMinimap {

    // Actual map properties
    private minX: number;
    private minY: number;
    private width: number;
    private height: number;

    // Minimap pixel properties
    private readonly pixelWidth: number;
    private readonly pixelHeight: number;
    private readonly colors: number[] = [];
    private readonly mapPixelFrames: framehandle[] = [];
    private mapFrame: framehandle;

    // Default minimap options
    private readonly defaultColor;
    private pixelTexture = 'Textures\\white.blp';

    // Generator options
    private currentX = 0;
    private currentY = 0;

    constructor(
        private readonly mapBounds: Rectangle,
        // private readonly heightProvider: IHeightNoiseProvider,
    ) {
        this.minX = mapBounds.minX;
        this.minY = mapBounds.minY;
        this.width = mapBounds.maxX - mapBounds.minX;
        this.height = mapBounds.maxY - mapBounds.minY;

        this.defaultColor = BlzConvertColor(255, 145, 104, 60);

        const minimapOrigin = Frame.fromOrigin(ORIGIN_FRAME_MINIMAP, 0);
        minimapOrigin.setAlpha(0);

        // BlzFrameSetVisible(minimap, false);
        const width = this.pixelWidth = minimapOrigin.width / 64;
        const height = this.pixelHeight = minimapOrigin.height / 64;

        Log.Info("TOC HAS LOADED?", BlzLoadTOCFile('MinimapPixel.toc'));
        // BlzLoadTOCFile('MapPixel.toc');

        // let customMinimap = Frame.fromHandle(BlzCreateSimpleFrame("DungeonMap", BlzGetFrameByName("ConsoleUI", 0), 0));
        let customMinimap = Frame.fromHandle(BlzCreateSimpleFrame("MinimapPixel", BlzGetFrameByName("ConsoleUI", 0), 0));
        customMinimap
            .setPoint(FRAMEPOINT_BOTTOMLEFT, minimapOrigin, FRAMEPOINT_BOTTOMLEFT, 0, 0)
            .setPoint(FRAMEPOINT_TOPRIGHT, minimapOrigin, FRAMEPOINT_TOPRIGHT, 0, 0);

        this.mapFrame = customMinimap.handle;

        const widthFuzz = 0.01 * width;
        const heightFuzz = 0.01 * height;
        for (let x = 0; x < 64; x++) {
            for (let y = 0; y < 64; y++) {

                let i = x + y * 64;
                this.colors[i] = this.defaultColor;
                // let name = 'DM_' + x + '_' + y;
                let frame = BlzCreateSimpleFrame('MinimapPixel', customMinimap.handle, 0);
                // const pixel = BlzGetFrameByName(name, 0);
                const pixel = BlzGetFrameByName('Pix', 0);
                this.mapPixelFrames[x + 64 * y] = pixel;
                
                BlzFrameClearAllPoints(pixel)
                BlzFrameSetSize(pixel, width + widthFuzz, height + heightFuzz);
                BlzFrameSetPoint(pixel, FRAMEPOINT_BOTTOMLEFT, customMinimap.handle, FRAMEPOINT_BOTTOMLEFT, x * width, y * height)
                BlzFrameSetTexture(pixel, this.pixelTexture, 0, true)
                BlzFrameSetVertexColor(pixel, this.defaultColor);
            }
        }
    }

    // public generateThread() {

    //     Log.Info("Regenerating minimap.");
    //     SetCameraBoundsToRect(this.mapBounds.handle);
    //     // Generate Surface
    //     const { maxX, maxY } = this.mapBounds;
    //     const { minX, minY } = this.mapBounds;
    //     const maxProgress = (-minX + maxX) * (-minY + maxY);

    //     let done = false;
    //     let thread = coroutine.create(() => {

    //         // Generate pathing
    //         for (let y = minY; y < maxY; y += 16) {
                
    //             for (let x = minX; x < maxX; x += 16) {
    
    //                 // if (x >= this.currentX || y >= this.currentY)
    //                 //     coroutine.yield();

    //                 let height = 2750 * this.heightProvider.getHeightValue(x, y) + 64;
    
    //                 if (height > 100) {
    
    //                     if (height >= 160) {
    //                         let darkness = height / 700;
    //                         if (darkness < 0) darkness = 0.1;
    //                         else if (darkness > 1) darkness = 1;
    
    //                         let grey = math.floor(150 - 150*darkness);
    //                         let col = BlzConvertColor(255, 5+grey, grey, grey);
    //                         this.setPoint(x, y, col);
    //                     }
    //                 } else if (height > 0) {
    //                     this.setPoint(x, y, BlzConvertColor(255, 166, 192, 137));
    //                 } else {
    //                     this.setPoint(x, y, BlzConvertColor(255, 0, 157, 225));
    //                 }
    //             }
    //         }

    //         done = true;
    //     });

    //     return thread;
        
    //     // let tim = new Timer();
    //     // tim.start(0.1, true, () => {
    //     //     if (done) tim.destroy();
    //     //     else coroutine.resume(thread);
    //     // });

    //     // return (currentX: number, currentY: number) => {
    //     //     // let mapX = math.floor(64 * (currentX - this.minX) / this.width + 0.5);
    //     //     // let mapY = math.floor(64 * (currentY - this.minY) / this.height + 0.5);
    //     //     this.currentX = currentX;
    //     //     this.currentY = currentY;

    //     //     coroutine.resume(thread);
    //     // };
    // }

    setPoint(x: number, y: number, color: number) {

        let mapX = math.floor(64 * (x - this.minX) / this.width + 0.5);
        let mapY = math.floor(64 * (y - this.minY) / this.height + 0.5);
        
        let i = mapX + mapY * 64;
        const pixel = this.mapPixelFrames[i];
        if (pixel) {
            this.colors[i] = color;
            BlzFrameSetVertexColor(pixel, color);
        }
    }

    setMiniPixel(col: number, row: number, color: number) {
        
        let i = col + row * 64;
        const pixel = this.mapPixelFrames[i];
        if (pixel) {
            this.colors[i] = color;
            BlzFrameSetVertexColor(pixel, color);
        }
    }
}