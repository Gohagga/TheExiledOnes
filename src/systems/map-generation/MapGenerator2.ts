import { Log } from "Log";
import { IMinimap } from "systems/minimap/IMinimap";
import { Random } from "systems/random/Random";
import { ResourceDropManager } from "systems/resource-drops/ResourceDropManager";
import { Rectangle } from "w3ts/index";
import { CaveHeightBuilder } from "./builders/CaveHeightBuilder";
import { CaveTileBuilder } from "./builders/CaveTileBuilder";
import { HeightBuilder } from "./builders/HeightBuilder";
import { MinimapBuilder } from "./builders/MinimapBuilder";
import { PathingBuilder, PathingType } from "./builders/PathingBuilder";
import { TileBuilder } from "./builders/TileBuilder";
import { TreeBuilder } from "./builders/TreeBuilder";
import { ICavernNoiseProvider } from "./interfaces/ICavernNoiseProvider";
import { IHeightNoiseProvider } from "./interfaces/IHeightNoiseProvider";
import { IMoistureNoiseProvider } from "./interfaces/IMoistureNoiseProvider";
import { ITreeNoiseProvider } from "./interfaces/ITreeNoiseProvider";
import { OrePlacer } from "./object-placers/OrePlacer";
import { RandomObjectPlacer } from "./object-placers/RandomObjectPlacer";

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
    public pathingBuilder!: PathingBuilder;

    constructor(
        private readonly minimap: IMinimap,
        private readonly heightNoise: IHeightNoiseProvider,
        private readonly treeNoise: ITreeNoiseProvider,
        private readonly moistureNoise: IMoistureNoiseProvider,
        private readonly cavernNoise: ICavernNoiseProvider,
        private readonly resourceDropManager: ResourceDropManager,
        private readonly surfaceBounds: Rectangle,
        private readonly undergroundBounds: Rectangle,
        random: Random,
    ) {
        this.generatorThread = coroutine.create(() => this.generateMap());
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
    
            // Builders
            let neutralHeight = 74;
            let waterHeight = 45;
            let heightBuilder = new HeightBuilder(this.heightNoise, neutralHeight, xDensity, yDensity, 128);
            this.heightBuilder = heightBuilder;
            let pathingBuilder = new PathingBuilder(heightBuilder, waterHeight);
            this.pathingBuilder = pathingBuilder;
            let tileBuilder = new TileBuilder(heightBuilder, pathingBuilder, this.moistureNoise);
            let treeBuilder = new TreeBuilder(heightBuilder, pathingBuilder, this.treeNoise, this.resourceDropManager, xDensity, yDensity, this.random)
            let caveHeightBuilder = new CaveHeightBuilder(this.cavernNoise, xDensUnder, yDensUnder, this.stepOffset, this.random); //1 / this.undergroundBounds.maxX
            let caveTileBuilder = new CaveTileBuilder(caveHeightBuilder);
            let minimapBuilder = new MinimapBuilder(this.minimap, heightBuilder, pathingBuilder, tileBuilder);

            // Object Placers
            let orePlacer = new OrePlacer(this.random, this.surfaceBounds, heightBuilder);
            let randomPlacer = new RandomObjectPlacer(this.random);
            
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

                        if (height > 150 && height < 180 && pathing == PathingType.HillSteepUnwalkable) {
                            orePlacer.AddPossibleStoneSpot({ x, y, z: height - waterHeight });
                        }
                        
                        if (tree) randomPlacer.AddTree(tree);
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

            let stonePileCount = math.floor((maxX - minX) / 305);
            let rocksCount = math.floor((maxX - minX) / 205);
            let branchCount = math.floor((maxX - minX) / 153);
            orePlacer.placeRocksAndStones(stonePileCount, rocksCount);
            randomPlacer.PlaceBranches(branchCount);
    
            this.isDone = true;
        } catch (err) {
            Log.Error(MapGenerator2, err);
        }
    }}

/*
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

            let mapWidth = (maxX - minX);
            let mapHeight = (maxY - minY);
            let widthDiv = 1 / mapWidth;
            let heightDiv = 1 / mapHeight;
            let miniOffsetX = (maxX - minX) / 64;
            let miniOffsetY = (maxY - minY) / 64;
            let lastMiniX = -1;
            let lastMiniY = -1;
            let miniLine = 0;
            
            for (let y = minY + math.floor(math.abs(mapHeight * 0.5 / 16))*16; y < maxY; y += 16) {
                for (let x = minX; x < maxX; x += 16) {
    
                    for (let l = 0; l < 2; l++) {

                        x *= -1;
                        y *= -1;

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
                }
                miniLine++;
            }
    
            this.isDone = true;
        } catch (err) {
            Log.Error(MapGenerator2, err);
        }
    }}

    */
}