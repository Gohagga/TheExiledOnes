import { Log } from "Log";
import { CustomMinimap } from "systems/minimap/CustomMinimap";
import { Random } from "systems/random/Random";
import { Rectangle } from "w3ts/index";
import { CaveHeightBuilder } from "./builders/CaveHeightBuilder";
import { CaveTileBuilder } from "./builders/CaveTileBuilder";
import { HeightBuilder } from "./builders/HeightBuilder";
import { MinimapBuilder } from "./builders/MinimapBuilder";
import { PathingBuilder } from "./builders/PathingBuilder";
import { TileBuilder } from "./builders/TileBuilder";
import { TreeBuilder } from "./builders/TreeBuilder";
import { ICavernNoiseProvider } from "./interfaces/ICavernNoiseProvider";
import { IHeightNoiseProvider } from "./interfaces/IHeightNoiseProvider";
import { IMoistureNoiseProvider } from "./interfaces/IMoistureNoiseProvider";
import { ITreeNoiseProvider } from "./interfaces/ITreeNoiseProvider";

export class MapGenerator2 {
    private readonly generatorThread: LuaThread;
    private readonly random: Random;

    private debt: number = 0;
    private maxDebt: number = 300;
    private stepOffset: number = 128;
    private paused = true;
    
    public progress: number = 0;
    public isDone: boolean = false;
    public startPoint: { x: number, y: number } = { x: 0, y: 0 }

    public heightBuilder!: HeightBuilder;

    constructor(
        private readonly minimap: CustomMinimap,
        private readonly heightNoise: IHeightNoiseProvider,
        private readonly treeNoise: ITreeNoiseProvider,
        private readonly moistureNoise: IMoistureNoiseProvider,
        private readonly cavernNoise: ICavernNoiseProvider,
        private readonly surfaceBounds: Rectangle,
        private readonly undergroundBounds: Rectangle,
        random: Random,
    ) {
        this.generatorThread = coroutine.create(() => this.generateMapFromCenter());
        this.random = random || new Random();
    }

    private static pause(gen: MapGenerator2) {
        gen.paused = true;
        coroutine.yield();
    }

    public resume() {
        if (this.paused) {
            this.debt = 0;
        }
        coroutine.resume(this.generatorThread);
    }

    private generateMap() {{

        try {

            let xDensity = 1 / 2784;
            let yDensity = 1 / 3008;

            let xDensUnder = 1 / 6528;
            let yDensUnder = 1 / 6528;

            let rec = new Rectangle(-11424.0, -3520.0, -4896.0, 3008.0);
            Log.Info("Rect", rec.minX, rec.minY, rec.maxX, rec.maxY);
    
            let neutralHeight = 74;
            let heightBuilder = new HeightBuilder(this.heightNoise, neutralHeight, xDensity, yDensity, 128);
            this.heightBuilder = heightBuilder;
            let pathingBuilder = new PathingBuilder(heightBuilder, 45);
            let tileBuilder = new TileBuilder(heightBuilder, pathingBuilder, this.moistureNoise);
            let treeBuilder = new TreeBuilder(heightBuilder, pathingBuilder, this.treeNoise, xDensity, yDensity, this.random)
            let caveHeightBuilder = new CaveHeightBuilder(this.cavernNoise, xDensUnder, yDensUnder, this.stepOffset, this.random); //1 / this.undergroundBounds.maxX
            let caveTileBuilder = new CaveTileBuilder(caveHeightBuilder);
            let minimapBuilder = new MinimapBuilder(this.minimap, heightBuilder, pathingBuilder, tileBuilder);
            
            // Generate Surface
            const { maxX, maxY } = this.surfaceBounds;
            const { minX, minY } = this.surfaceBounds;
            const maxProgress = (-minX + maxX) * (-minY + maxY);

            let widthDiv = 1 / (maxX - minX);
            let heightDiv = 1 / (maxY - minY);
            let miniOffsetX = (maxX - minX) / 64;
            let miniOffsetY = (maxY - minY) / 64;
            let lastMiniX = -1;
            let lastMiniY = -1;
            let miniLine = 0;
            
            for (let y = minY; y < maxY; y += 16) {
                for (let x = minX; x < maxX; x += 16) {
    
                    let height = heightBuilder.getHeight(x, y);
                    let pathing = pathingBuilder.getPathing(x, y, height);
                    let tile = tileBuilder.getTileType(x, y, pathing, height);

                    // We update tile every 8 steps
                    if (x % this.stepOffset == 0 && 
                        y % this.stepOffset == 0
                    ) {
                        let tree = treeBuilder.getTree(x, y, pathing, height);

                        this.debt += heightBuilder.buildDeformation(x, y, height);
                        this.debt += tileBuilder.buildTerrainTile(x, y, tile);
                        this.debt += treeBuilder.buildTreeOrDont(x, y, pathing, height);

                        let underX = x - this.surfaceBounds.minX + this.undergroundBounds.minX;
                        let underY = y - this.surfaceBounds.minY + this.undergroundBounds.minY;
                        this.debt += caveHeightBuilder.buildCaveHeight(underX, underY);
                        this.debt += caveTileBuilder.buildCaveTile(underX, underY);
                    }
                    this.debt += pathingBuilder.buildPathing(x, y, pathing);

                    let xPerc = (x - minX) * widthDiv;
                    let yPerc = (y - minY) * heightDiv;
                    let miniX = math.floor(64 * xPerc + 0.5);
                    let miniY = math.floor(64 * yPerc + 0.5);
                    
                    if (lastMiniX != miniX && (miniLine == 0 || lastMiniY != miniY)) {
                        lastMiniX = miniX;
                        lastMiniY = miniY;
                        miniLine = 0;

                        let miniPixColor = minimapBuilder.getMiniPixColor(x, y, tile, pathing, height);
                        this.debt += minimapBuilder.buildMiniPixRaw(miniX, miniY, x, y, miniPixColor);
                    }

                    this.progress = ((y - minY) * (maxX - minX) + x - minX) / maxProgress;
                    if (this.debt > this.maxDebt)
                        MapGenerator2.pause(this);
                }
                miniLine++;
            }
    
            this.isDone = true;
        } catch (err) {
            Log.Error(MapGenerator2, err);
        }
    }}

    private generateMapFromCenter() {{

        try {

            let xDensity = 1 / 2784;
            let yDensity = 1 / 3008;

            let xDensUnder = 1 / 6528;
            let yDensUnder = 1 / 6528;

            let rec = new Rectangle(-11424.0, -3520.0, -4896.0, 3008.0);
            Log.Info("Rect", rec.minX, rec.minY, rec.maxX, rec.maxY);
    
            let neutralHeight = 74;
            let heightBuilder = new HeightBuilder(this.heightNoise, neutralHeight, xDensity, yDensity, 128);
            this.heightBuilder = heightBuilder;
            let pathingBuilder = new PathingBuilder(heightBuilder, 45);
            let tileBuilder = new TileBuilder(heightBuilder, pathingBuilder, this.moistureNoise);
            let treeBuilder = new TreeBuilder(heightBuilder, pathingBuilder, this.treeNoise, xDensity, yDensity, this.random)
            let caveHeightBuilder = new CaveHeightBuilder(this.cavernNoise, xDensUnder, yDensUnder, this.stepOffset, this.random); //1 / this.undergroundBounds.maxX
            let caveTileBuilder = new CaveTileBuilder(caveHeightBuilder);
            let minimapBuilder = new MinimapBuilder(this.minimap, heightBuilder, pathingBuilder, tileBuilder);
            
            // Generate Surface
            const { maxX, maxY } = this.surfaceBounds;
            const { minX, minY } = this.surfaceBounds;
            const maxProgress = (-minX + maxX) * (-minY + maxY);

            let widthDiv = 1 / (maxX - minX);
            let heightDiv = 1 / (maxY - minY);
            let miniOffsetX = (maxX - minX) / 64;
            let miniOffsetY = (maxY - minY) / 64;
            let lastMiniX = -1;
            let lastMiniY = -1;
            let miniLine = 0;

            let stepX = math.floor((maxX - minX) * 0.5) + minX;
            let stepY = math.floor((maxY - minY) * 0.5) + minY;

            let cellWidth = math.floor((maxX - minX) / 16);
            let cellHeight = math.floor((maxY - minY) / 16);

            let centerX = math.floor(cellWidth * 0.5) + 1;
            let centerY = math.floor(cellHeight * 0.5) + 1;

            
            // Generate an Ulam spiral centered at (0, 0).
            let M = (maxX - minX);
            let N = (maxY - minY);
            let x = 0;
            let y = 0;

            let end = math.max(N, M) * math.max(N, M);
            for (let i = 0; i < end; ++i)
            {
                // Translate coordinates and mask them out.
                let xp = x + N / 2;
                let yp = y + M / 2;
                if(xp >= 0 && xp < N && yp >= 0 && yp < M) {
                    
                    heightBuilder.buildDeformation(minX + , minY + 16 * y, 64);
                        this.debt += 5;
                    // }
                    print(x, y)
                    if (this.debt > this.maxDebt)
                        MapGenerator2.pause(this);

                    print(xp, yp);
                }

                // No need to track (dx, dy) as the other examples do:
                if(math.abs(x) <= math.abs(y) && (x != y || x >= 0))
                    x += ((y >= 0) ? 1 : -1);
                else
                    y += ((x >= 0) ? -1 : 1);
            }

            let x = 0;
            let y = 0;
            let dx = 0
            let dy = 1
            for (let i = 0; i < maxI; i++) {
                if ((-cellWidth/2 < x && x <= cellWidth/2) && (-cellHeight/2 < y && y <= cellHeight/2)) {

                    // if (
                    //     // pos[0] % 2 == 0 &&
                    //     // pos[1] % 2 == 0
                    //     x % this.stepOffset == 0 && 
                    //     y % this.stepOffset == 0
                    // ) {
                        heightBuilder.buildDeformation(minX + 16 * x, minY + 16 * y, 64);
                        this.debt += 5;
                    // }
                    print(x, y)
                    if (this.debt > this.maxDebt)
                        MapGenerator2.pause(this);
                }
                if (x == -y || (x < 0 && x == y) || (x > 0 && x-1 == y)) {
                    dx = dy;
                    dy = -dx;
                }
                x += dx;
                y += dy;
            }

            /*
            for (let i = 0; i < maxI; i++) {

                let pos = this.spiral(i);
                let x = math.floor((centerX + pos[0]) * 16);
                let y = math.floor((centerY + pos[1]) * 16);

                print(pos[0], pos[1]);

                if (
                    // pos[0] % 2 == 0 &&
                    // pos[1] % 2 == 0
                    x % this.stepOffset == 0 && 
                    y % this.stepOffset == 0
                ) {
                    heightBuilder.buildDeformation(minX + x, minY + y, 64);
                }
                // TerrainDeformCrater(stepX + x, stepY + y, 128, -64, 1, true);
                this.debt += 5;
                

                // let height = heightBuilder.getHeight(x, y);
                // let pathing = pathingBuilder.getPathing(x, y, height);
                // let tile = tileBuilder.getTileType(x, y, pathing, height);

                // // We update tile every 8 steps
                // if (x % this.stepOffset == 0 && 
                //     y % this.stepOffset == 0
                // ) {
                //     let tree = treeBuilder.getTree(x, y, pathing, height);

                //     this.debt += heightBuilder.buildDeformation(x, y, height);
                //     this.debt += tileBuilder.buildTerrainTile(x, y, tile);
                //     this.debt += treeBuilder.buildTreeOrDont(x, y, pathing, height);

                //     let underX = x - this.surfaceBounds.minX + this.undergroundBounds.minX;
                //     let underY = y - this.surfaceBounds.minY + this.undergroundBounds.minY;
                //     this.debt += caveHeightBuilder.buildCaveHeight(underX, underY);
                //     this.debt += caveTileBuilder.buildCaveTile(underX, underY);
                // }
                // this.debt += pathingBuilder.buildPathing(x, y, pathing);

                // let xPerc = (x - minX) * widthDiv;
                // let yPerc = (y - minY) * heightDiv;
                // let miniX = math.floor(64 * xPerc + 0.5);
                // let miniY = math.floor(64 * yPerc + 0.5);
                
                // if (lastMiniX != miniX || lastMiniY != miniY) {
                //     lastMiniX = miniX;
                //     lastMiniY = miniY;
                //     miniLine = 0;

                //     let miniPixColor = minimapBuilder.getMiniPixColor(x, y, tile, pathing, height);
                //     this.debt += minimapBuilder.buildMiniPixRaw(miniX, miniY, x, y, miniPixColor);
                // }

                // this.progress = ((y - minY) * (maxX - minX) + x - minX) / maxProgress;
                if (this.debt > this.maxDebt)
                    MapGenerator2.pause(this);
            }*/
    
            this.isDone = true;
        } catch (err) {
            Log.Error(MapGenerator2, err);
        }
    }}

    spiral(steps: number) {
        // given n an index in the squared spiral
        // p the sum of point in inner square
        // a the position on the current square
        // n = p + a
    
        // Original code: http://jsfiddle.net/davidonet/HJQ4g/
        if (steps === 0) return [0, 0, 0];
        --steps;
        
        let r = math.floor((math.sqrt(steps + 1) - 1) / 2) + 1;
        
        // compute radius : inverse arithmetic sum of 8+16+24+...=
        let p = (8 * r * (r - 1)) / 2;
        // compute total point on radius -1 : arithmetic sum of 8+16+24+...
    
        let en = r * 2;
        // points by face
    
        let a = (1 + steps - p) % (r * 8);
        // compute de position and shift it so the first is (-r,-r) but (-r+1,-r)
        // so square can connect
    
        let pos = [0, 0, r];
        switch (Math.floor(a / (r * 2))) {
            // find the face : 0 top, 1 right, 2, bottom, 3 left
            case 0:
                {
                    pos[0] = math.floor(a - r);
                    pos[1] = -r;
                }
                break;
            case 1:
                {
                    pos[0] = r;
                    pos[1] = math.floor(a % en) - r;
    
                }
                break;
            case 2:
                {
                    pos[0] = r - math.floor(a % en);
                    pos[1] = r;
                }
                break;
            case 3:
                {
                    pos[0] = -r;
                    pos[1] = r - math.floor(a % en);
                }
                break;
        }
        return pos;
    }

    // spiral(M: number, N: number)
    // {
    //     // Generate an Ulam spiral centered at (0, 0).
    //     let x = 0;
    //     let y = 0;

    //     let end = math.max(N, M) * math.max(N, M);
    //     for (let i = 0; i < end; ++i)
    //     {
    //         // Translate coordinates and mask them out.
    //         let xp = x + N / 2;
    //         let yp = y + M / 2;
    //         if(xp >= 0 && xp < N && yp >= 0 && yp < M)
    //             print(xp, yp);

    //         // No need to track (dx, dy) as the other examples do:
    //         if(math.abs(x) <= math.abs(y) && (x != y || x >= 0))
    //             x += ((y >= 0) ? 1 : -1);
    //         else
    //             y += ((x >= 0) ? -1 : 1);
    //     }
    // }
}