import { Log } from "Log";
import { CustomMinimap } from "systems/minimap/CustomMinimap";
import { Minimap } from "systems/minimap/Minimap";
import { Random } from "systems/random/Random";
import { Color, Point, Rectangle } from "w3ts/index";
import { ICavernNoiseProvider } from "./interfaces/ICavernNoiseProvider";
import { IHeightNoiseProvider } from "./interfaces/IHeightNoiseProvider";
import { IMoistureNoiseProvider } from "./interfaces/IMoistureNoiseProvider";
import { ITreeNoiseProvider } from "./interfaces/ITreeNoiseProvider";
import { PoissonDisk } from "./procedural/PoissonDisk";

export enum TerrainType {
    Rock = FourCC('Lrok'),
    ThinGrass = FourCC('Ldrg'),
    ThickGrass = FourCC('Lgrd'),
    Grass = FourCC('Lgrs'),
    Dirt = FourCC('Ldrt'),
    RoughDirt = FourCC('Ldro'),
}

export class MapGenerator {
    private readonly generatorThread: LuaThread;
    private readonly random: Random;
    private readonly poisson: PoissonDisk;

    private debt: number = 0;
    private maxDebt: number = 300;
    private stepOffset: number = 128;
    private paused = true;
    
    public progress: number = 0;
    public isDone: boolean = false;
    public startPoint: { x: number, y: number } = { x: 0, y: 0 }

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
        this.generatorThread = coroutine.create(() => this.generateMap());
        this.random = random || new Random();
        this.poisson = new PoissonDisk(this.random);
    }

    private static pause(gen: MapGenerator) {
        gen.paused = true;
        coroutine.yield();
        coroutine.resume(gen.generatorThread);
    }

    public resume() {
        if (this.paused) {
            this.debt = 0;
        }
        coroutine.resume(this.generatorThread);
    }

    private generateMap() {{

        Log.Info("Started map generation");
        
        // FogModifierStart(CreateFogModifierRect(Player(0), FOG_OF_WAR_VISIBLE, GetPlayableMapRect(), true, true));

        // this.generateSurface();

        this.generateUnderground();

        this.isDone = true;
    }}

    private generateSurface() {

        // Generate Surface
        const { maxX, maxY } = this.surfaceBounds;
        const { minX, minY } = this.surfaceBounds;
        const maxProgress = (-minX + maxX) * (-minY + maxY);

        let smallest = 1000;
        let highest = 0;

        // let halfTilePercX = 64 / maxX;
        let spawnPoints: { x: number, y: number }[] = [];
        
        // let minimapThread = this.minimap.generateThread();
        // coroutine.resume(minimapThread);

        // Generate height
        for (let y = minY; y < maxY; y += this.stepOffset) {
            
            // let ny = y / 3500;
            // let ny = y / 2784.0;
            // let ny = y / 3008.0;//2784.0;
            // let ny = y / maxY;
            for (let x = minX; x < maxX; x += this.stepOffset) {

                // minimapThread(x, y);

                // let nx = x / 3500;
                // let nx = x / 2784.0;
                // let nx = x / 3008.0;
                // let nx = x / maxX;
                let height = this.heightNoise.getHeightValue(x, y);
                height = 2750 * height + 64;

                TerrainDeformCrater(x, y, this.stepOffset, -height, 1, true);

                this.debt += 2;
                
                this.progress = ((y - minY) * (maxX - minX) + x - minX) / maxProgress;

                
                if (height > 100) {
                    
                    if (height > 160) {
                        SetTerrainType(x, y, TerrainType.Rock, 0, 1, 0);
                    }

                    // Check slopes around
                    let slope = 80;
                    let c1 = 2750 * this.heightNoise.getHeightValue(x - 64, y - 64) + 64;
                    if (math.abs(c1 - height) > slope) {
                        SetTerrainType(x, y, TerrainType.Rock, 0, 1, 0);
                        // SetTerrainPathable(x, y, PATHING_TYPE_WALKABILITY, false);
                        // SetTerrainPathable(x - 64, y, PATHING_TYPE_WALKABILITY, false);
                        // SetTerrainPathable(x, y - 64, PATHING_TYPE_WALKABILITY, false);
                        // Log.error("height", height, "c1", c1);
                    }
                    let c2 = 2750 * this.heightNoise.getHeightValue(x + 128, y - 64) + 64;
                    if (math.abs(c2 - height) > slope) {
                        SetTerrainType(x + 64, y, TerrainType.Rock, 0, 1, 0);
                        // SetTerrainPathable(x + 64, y, PATHING_TYPE_WALKABILITY, false);
                        // SetTerrainPathable(x + 64, y - 64, PATHING_TYPE_WALKABILITY, false);
                        // SetTerrainPathable(x + 128, y, PATHING_TYPE_WALKABILITY, false);
                        // Log.error("height", height, "c2", c2);
                    }
                    let c3 = 2750 * this.heightNoise.getHeightValue(x - 64, y + 128) + 64;
                    if (math.abs(c3 - height) > slope) {
                        SetTerrainType(x, y + 64, TerrainType.Rock, 0, 1, 0);
                        // SetTerrainPathable(x, y + 64, PATHING_TYPE_WALKABILITY, false);
                        // SetTerrainPathable(x - 64, y + 64, PATHING_TYPE_WALKABILITY, false);
                        // SetTerrainPathable(x, y + 128, PATHING_TYPE_WALKABILITY, false);
                        // Log.error("height", height, "c3", c3);
                    }
                    let c4 = 2750 * this.heightNoise.getHeightValue(x + 128, y + 128) + 64;
                    if (math.abs(c4 - height) > slope) {
                        SetTerrainType(x + 64, y + 64, TerrainType.Rock, 0, 1, 0);
                        // SetTerrainPathable(x + 64, y + 64, PATHING_TYPE_WALKABILITY, false);
                        // SetTerrainPathable(x + 128, y + 64, PATHING_TYPE_WALKABILITY, false);
                        // SetTerrainPathable(x + 64, y + 128, PATHING_TYPE_WALKABILITY, false);
                        // Log.error("height", height, "c4", c4);
                    }
                    // }
                } else if (height > 60) {
                    let moisture = this.moistureNoise.getValue(x, y);
                    if (moisture > highest) highest = moisture;
                    if (moisture < smallest) smallest = moisture;
                    if (moisture >= 0.55) {
                        SetTerrainType(x, y, TerrainType.ThickGrass, 0, 1, 1);
                    }
                    else if (moisture > 0.3)
                        SetTerrainType(x, y, TerrainType.Grass, 0, 1, 1);
                    else
                        SetTerrainType(x, y, TerrainType.ThinGrass, 0, 1, 0);

                    // SetTerrainPathable(x, y, PATHING_TYPE_BUILDABILITY, true);
                } else if (height < 0) {
                    // SetTerrainType(x, y, TerrainType.Rock, 0, 1, 1);
                    // SetTerrainPathable(x, y-64, PATHING_TYPE_WALKABILITY, false);
                    // SetTerrainPathable(x + 64, y-64, PATHING_TYPE_WALKABILITY, false);
                    // SetTerrainPathable(x, y, PATHING_TYPE_WALKABILITY, false);
                    // SetTerrainPathable(x + 64, y, PATHING_TYPE_WALKABILITY, false);
                }
                    
                // let tree = this.treeNoise.getTreeValue(x, y, height).type;
                // if (tree > 0) {
                //     this.debt += 3;
                //     if (this.random.next() <= tree * 0.5) {

                //         let tx = this.random.nextInt(-32, 32) + x;
                //         let ty = this.random.nextInt(-32, 32) + y;
                //         CreateDestructable(FourCC('LTlt'), tx, ty, 270, this.random.next(0.8, 1.3), 0);
                //     }
                // }

                if (math.abs(x) < 0.5 && math.abs(y) < 0.5 && height <= 70 && height > 64) {
                    spawnPoints.push({ x, y });
                }

                if (this.debt >= this.maxDebt)
                    MapGenerator.pause(this);
            }
        }

        // this.minimap.updateMinimap(this.surfaceBounds, (x1, y1) =>
        //     this.heightNoise.getHeightValue(x1 / maxX, y1 / maxY));

        // Generate pathing
        for (let y = minY; y < maxY; y += 16) {
            
            // let ny = y / maxY;
            for (let x = minX; x < maxX; x += 16) {

                // let nx = x / maxX;
                let height = 2750 * this.heightNoise.getHeightValue(x, y) + 64;

                // if (height > 160) {
                //     let col = BlzConvertColor(255, 60, 60, 60);
                //     this.minimap.setPoint(x, y, col);
                //     this.minimap.setPoint(x+64, y, col);
                //     this.minimap.setPoint(x, y+64, col);
                //     this.minimap.setPoint(x+64, y+64, col);
                // } else {
                //     let col = BlzConvertColor(256, 256, 256, 256);
                //     this.minimap.setPoint(x, y, col);
                //     this.minimap.setPoint(x+64, y, col);
                //     this.minimap.setPoint(x, y+64, col);
                //     this.minimap.setPoint(x+64, y+64, col);
                // }

                if (height > 100) {

                    if (height < 160) SetTerrainPathable(x, y, PATHING_TYPE_BUILDABILITY, true);
                    else {
                        // let darkness = height / 700;
                        // if (darkness < 0) darkness = 0.1;
                        // else if (darkness > 1) darkness = 1;

                        // let grey = math.floor(150 - 150*darkness);
                        // let col = BlzConvertColor(255, 5+grey, grey, grey);
                        // this.minimap.setPoint(x, y, col);
                    }

                    // Check slopes around
                    let slope = 30;
                    let c1 = 2750 * this.heightNoise.getHeightValue(x - 16, y - 16) + 64;
                    if (math.abs(c1 - height) > slope) {
                        SetTerrainPathable(x, y, PATHING_TYPE_WALKABILITY, false);
                        SetTerrainPathable(x - 16, y, PATHING_TYPE_WALKABILITY, false);
                        SetTerrainPathable(x, y - 16, PATHING_TYPE_WALKABILITY, false);
                        // Log.error("height", height, "c1", c1);
                        SetTerrainPathable(x, y, PATHING_TYPE_BUILDABILITY, false);
                        SetTerrainPathable(x - 16, y, PATHING_TYPE_BUILDABILITY, false);
                        SetTerrainPathable(x, y - 16, PATHING_TYPE_BUILDABILITY, false);
                    }
                    let c2 = 2750 * this.heightNoise.getHeightValue(x + 32, y - 16) + 64;
                    if (math.abs(c2 - height) > slope) {
                        SetTerrainPathable(x + 16, y, PATHING_TYPE_WALKABILITY, false);
                        SetTerrainPathable(x + 16, y - 16, PATHING_TYPE_WALKABILITY, false);
                        SetTerrainPathable(x + 32, y, PATHING_TYPE_WALKABILITY, false);
                        // Log.error("height", height, "c2", c2);
                        SetTerrainPathable(x + 16, y, PATHING_TYPE_BUILDABILITY, false);
                        SetTerrainPathable(x + 16, y - 16, PATHING_TYPE_BUILDABILITY, false);
                        SetTerrainPathable(x + 32, y, PATHING_TYPE_BUILDABILITY, false);
                    }
                    let c3 = 2750 * this.heightNoise.getHeightValue(x - 16, y + 32) + 64;
                    if (math.abs(c3 - height) > slope) {
                        SetTerrainPathable(x, y + 16, PATHING_TYPE_WALKABILITY, false);
                        SetTerrainPathable(x - 16, y + 16, PATHING_TYPE_WALKABILITY, false);
                        SetTerrainPathable(x, y + 32, PATHING_TYPE_WALKABILITY, false);
                        // Log.error("height", height, "c3", c3);
                        SetTerrainPathable(x, y + 16, PATHING_TYPE_BUILDABILITY, false);
                        SetTerrainPathable(x - 16, y + 16, PATHING_TYPE_BUILDABILITY, false);
                        SetTerrainPathable(x, y + 32, PATHING_TYPE_BUILDABILITY, false);
                    }
                    let c4 = 2750 * this.heightNoise.getHeightValue(x + 32, y + 32) + 64;
                    if (math.abs(c4 - height) > slope) {
                        SetTerrainPathable(x + 16, y + 16, PATHING_TYPE_WALKABILITY, false);
                        SetTerrainPathable(x + 32, y + 16, PATHING_TYPE_WALKABILITY, false);
                        SetTerrainPathable(x + 16, y + 32, PATHING_TYPE_WALKABILITY, false);
                        // Log.error("height", height, "c4", c4);
                        SetTerrainPathable(x + 16, y + 16, PATHING_TYPE_BUILDABILITY, false);
                        SetTerrainPathable(x + 32, y + 16, PATHING_TYPE_BUILDABILITY, false);
                        SetTerrainPathable(x + 16, y + 32, PATHING_TYPE_BUILDABILITY, false);
                    }

                    this.debt += 0.4;
                } else if (height > 40) {
                    SetTerrainPathable(x, y, PATHING_TYPE_BUILDABILITY, true);
                    // this.minimap.setPoint(x, y, BlzConvertColor(255, 166, 192, 137));
                } else {
                    SetTerrainPathable(x, y, PATHING_TYPE_FLOATABILITY, true);
                    SetTerrainPathable(x, y, PATHING_TYPE_WALKABILITY, false);
                    SetTerrainPathable(x, y, PATHING_TYPE_BUILDABILITY, false);
                    // this.minimap.setPoint(x, y, BlzConvertColor(255, 0, 157, 225));
                }

                this.progress = ((y - minY) * (maxX - minX) + x - minX) / maxProgress;

                if (this.debt >= this.maxDebt)
                    MapGenerator.pause(this);
            }
        }

        let remainingPoints: { x: number, y: number }[] = [];
        for (let p of spawnPoints) {
            let nearDestruct = false;
            EnumDestructablesInRectAll(Rect(p.x-100, p.y-100, p.x+100, p.y+100), () => {
                if (GetEnumDestructable())
                    nearDestruct = true;
            });
            if (nearDestruct == false) {
                remainingPoints.push(p);
            }
        }
        if (remainingPoints.length > 0)
            spawnPoints = remainingPoints;

        Log.Info("SMALLEST", smallest, "HIGHEST", highest, "starting points", spawnPoints.length);

        let spawnIndex = math.floor(math.random() * (spawnPoints.length - 1));
        this.startPoint = spawnPoints[spawnIndex];
    }

    private generateUnderground() {

        const { maxX, maxY } = this.undergroundBounds;
        const { minX, minY } = this.undergroundBounds;

        const minX1 = -11424.0;
        const minY1 = -3520.0;
        const maxX1 = -4896.0;
        // const maxX1 = maxX;
        const maxY1 = 3008.0;
        // const maxY1 = maxY;
        const maxProgress = (-minX + maxX) * (-minY + maxY);

        // Generate underground
        for (let y = minY; y < maxY; y += this.stepOffset) {
            
            let ny = y / maxY1;
            for (let x = minX; x < maxX; x += this.stepOffset) {

                let nx = x / maxX1;
                // Log.Info("before getting height for ", x, y);
                // let height = this.cavernNoise.getDepthValue(nx, ny);
                let height = this.cavernNoise.getDepthValue((x - minX1)/(maxX1-minX1), (y - minY1)/(maxY1-minY1));
                height = 1000 * height + 100;
                
                if (height < 64) {
                    height = height ** 0.8 + 64;
                    // height += 64;
                } else if (height > 0) {
                    CreateDestructableZ(FourCC('DTrc'), x + 64, y, 100, this.random.next(0, 360), 1.25, this.random.nextInt(0, 6));
                }
                TerrainDeformCrater(x, y, this.stepOffset, -64, 1, true);
                this.debt += 2;
                
                this.progress = ((y - minY) * (maxX - minX) + x - minX) / maxProgress;
                
                let moisture = height / 1100;
                if (moisture % 0.2 > 0.1 || moisture < 0.1) {
                    SetTerrainType(x, y, TerrainType.RoughDirt, 0, 1, 1);
                } else
                    SetTerrainType(x, y, TerrainType.Dirt, 0, 1, 1);

                SetTerrainPathable(x, y, PATHING_TYPE_BUILDABILITY, true);

                if (this.debt >= this.maxDebt)
                    MapGenerator.pause(this);
            }
        }
    }
}