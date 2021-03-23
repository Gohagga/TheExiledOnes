import { Log } from "Log";
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
        private readonly minimap: Minimap,
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
        // coroutine.resume(gen.generatorThread);
    }

    public resume() {
        if (this.paused) {
            this.debt = 0;
        }
        coroutine.resume(this.generatorThread);
    }

    private generateMap() {{

        Log.Info("Started map generation");
        
        FogModifierStart(CreateFogModifierRect(Player(0), FOG_OF_WAR_VISIBLE, GetPlayableMapRect(), true, true));

        this.generateSurface();

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
        
        // Generate height
        for (let y = minY; y < maxY; y += this.stepOffset) {
            
            let ny = y / maxY;
            for (let x = minX; x < maxX; x += this.stepOffset) {

                let nx = x / maxX;
                let height = this.heightNoise.getHeightValue(nx, ny);
                height = 2750 * height + 64;

                TerrainDeformCrater(x, y, this.stepOffset, -height, 1, true);

                this.debt += 2;
                
                this.progress = ((y - minY) * (maxX - minX) + x - minX) / maxProgress;

                
                if (height > 100) {
                    
                    if (height > 160) {
                        this.minimap.setPoint(x, y, BlzConvertColor(255, 60, 60, 60));
                        SetTerrainType(x, y, TerrainType.Rock, 0, 1, 0);
                    } else {
                        this.minimap.setPoint(x, y, BlzConvertColor(256, 256, 256, 256));
                    }

                    // Check slopes around
                    let slope = 80;
                    let c1 = 2750 * this.heightNoise.getHeightValue((x - 64) / maxX, (y - 64) / maxY) + 64;
                    if (math.abs(c1 - height) > slope) {
                        SetTerrainType(x, y, TerrainType.Rock, 0, 1, 0);
                        // SetTerrainPathable(x, y, PATHING_TYPE_WALKABILITY, false);
                        // SetTerrainPathable(x - 64, y, PATHING_TYPE_WALKABILITY, false);
                        // SetTerrainPathable(x, y - 64, PATHING_TYPE_WALKABILITY, false);
                        // Log.error("height", height, "c1", c1);
                    }
                    let c2 = 2750 * this.heightNoise.getHeightValue((x + 128) / maxX, (y - 64) / maxY) + 64;
                    if (math.abs(c2 - height) > slope) {
                        SetTerrainType(x + 64, y, TerrainType.Rock, 0, 1, 0);
                        // SetTerrainPathable(x + 64, y, PATHING_TYPE_WALKABILITY, false);
                        // SetTerrainPathable(x + 64, y - 64, PATHING_TYPE_WALKABILITY, false);
                        // SetTerrainPathable(x + 128, y, PATHING_TYPE_WALKABILITY, false);
                        // Log.error("height", height, "c2", c2);
                    }
                    let c3 = 2750 * this.heightNoise.getHeightValue((x - 64) / maxX, (y + 128) / maxY) + 64;
                    if (math.abs(c3 - height) > slope) {
                        SetTerrainType(x, y + 64, TerrainType.Rock, 0, 1, 0);
                        // SetTerrainPathable(x, y + 64, PATHING_TYPE_WALKABILITY, false);
                        // SetTerrainPathable(x - 64, y + 64, PATHING_TYPE_WALKABILITY, false);
                        // SetTerrainPathable(x, y + 128, PATHING_TYPE_WALKABILITY, false);
                        // Log.error("height", height, "c3", c3);
                    }
                    let c4 = 2750 * this.heightNoise.getHeightValue((x + 128) / maxX, (y + 128) / maxY) + 64;
                    if (math.abs(c4 - height) > slope) {
                        SetTerrainType(x + 64, y + 64, TerrainType.Rock, 0, 1, 0);
                        // SetTerrainPathable(x + 64, y + 64, PATHING_TYPE_WALKABILITY, false);
                        // SetTerrainPathable(x + 128, y + 64, PATHING_TYPE_WALKABILITY, false);
                        // SetTerrainPathable(x + 64, y + 128, PATHING_TYPE_WALKABILITY, false);
                        // Log.error("height", height, "c4", c4);
                    }
                    // }
                } else if (height > 60) {
                    let moisture = this.moistureNoise.getValue(nx, ny);
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
                    
                let tree = this.treeNoise.getTreeValue(nx, ny, height).type;
                if (tree > 0) {
                    this.debt += 3;
                    if (this.random.next() <= tree * 0.5) {

                        let tx = this.random.nextInt(-32, 32) + x;
                        let ty = this.random.nextInt(-32, 32) + y;
                        CreateDestructable(FourCC('LTlt'), tx, ty, 270, this.random.next(0.8, 1.3), 0);
                    }
                }

                if (math.abs(nx) < 0.5 && math.abs(ny) < 0.5 && height <= 70 && height > 64) {
                    spawnPoints.push({ x, y });
                }

                if (this.debt >= this.maxDebt)
                    MapGenerator.pause(this);
            }
        }

        // Generate pathing
        for (let y = minY; y < maxY; y += 16) {
            
            let ny = y / maxY;
            for (let x = minX; x < maxX; x += 16) {

                let nx = x / maxX;
                let height = 2750 * this.heightNoise.getHeightValue(nx, ny) + 64;

                if (height > 100) {

                    if (height < 160) SetTerrainPathable(x, y, PATHING_TYPE_BUILDABILITY, true);
                    // Check slopes around
                    let slope = 30;
                    let c1 = 2750 * this.heightNoise.getHeightValue((x - 16) / maxX, (y - 16) / maxY) + 64;
                    if (math.abs(c1 - height) > slope) {
                        SetTerrainPathable(x, y, PATHING_TYPE_WALKABILITY, false);
                        SetTerrainPathable(x - 16, y, PATHING_TYPE_WALKABILITY, false);
                        SetTerrainPathable(x, y - 16, PATHING_TYPE_WALKABILITY, false);
                        // Log.error("height", height, "c1", c1);
                        SetTerrainPathable(x, y, PATHING_TYPE_BUILDABILITY, false);
                        SetTerrainPathable(x - 16, y, PATHING_TYPE_BUILDABILITY, false);
                        SetTerrainPathable(x, y - 16, PATHING_TYPE_BUILDABILITY, false);
                    }
                    let c2 = 2750 * this.heightNoise.getHeightValue((x + 32) / maxX, (y - 16) / maxY) + 64;
                    if (math.abs(c2 - height) > slope) {
                        SetTerrainPathable(x + 16, y, PATHING_TYPE_WALKABILITY, false);
                        SetTerrainPathable(x + 16, y - 16, PATHING_TYPE_WALKABILITY, false);
                        SetTerrainPathable(x + 32, y, PATHING_TYPE_WALKABILITY, false);
                        // Log.error("height", height, "c2", c2);
                        SetTerrainPathable(x + 16, y, PATHING_TYPE_BUILDABILITY, false);
                        SetTerrainPathable(x + 16, y - 16, PATHING_TYPE_BUILDABILITY, false);
                        SetTerrainPathable(x + 32, y, PATHING_TYPE_BUILDABILITY, false);
                    }
                    let c3 = 2750 * this.heightNoise.getHeightValue((x - 16) / maxX, (y + 32) / maxY) + 64;
                    if (math.abs(c3 - height) > slope) {
                        SetTerrainPathable(x, y + 16, PATHING_TYPE_WALKABILITY, false);
                        SetTerrainPathable(x - 16, y + 16, PATHING_TYPE_WALKABILITY, false);
                        SetTerrainPathable(x, y + 32, PATHING_TYPE_WALKABILITY, false);
                        // Log.error("height", height, "c3", c3);
                        SetTerrainPathable(x, y + 16, PATHING_TYPE_BUILDABILITY, false);
                        SetTerrainPathable(x - 16, y + 16, PATHING_TYPE_BUILDABILITY, false);
                        SetTerrainPathable(x, y + 32, PATHING_TYPE_BUILDABILITY, false);
                    }
                    let c4 = 2750 * this.heightNoise.getHeightValue((x + 32) / maxX, (y + 32) / maxY) + 64;
                    if (math.abs(c4 - height) > slope) {
                        SetTerrainPathable(x + 16, y + 16, PATHING_TYPE_WALKABILITY, false);
                        SetTerrainPathable(x + 32, y + 16, PATHING_TYPE_WALKABILITY, false);
                        SetTerrainPathable(x + 16, y + 32, PATHING_TYPE_WALKABILITY, false);
                        // Log.error("height", height, "c4", c4);
                        SetTerrainPathable(x + 16, y + 16, PATHING_TYPE_BUILDABILITY, false);
                        SetTerrainPathable(x + 32, y + 16, PATHING_TYPE_BUILDABILITY, false);
                        SetTerrainPathable(x + 16, y + 32, PATHING_TYPE_BUILDABILITY, false);
                    }

                    this.debt += 0.2;
                } else if (height > 0) {
                    SetTerrainPathable(x, y, PATHING_TYPE_BUILDABILITY, true);
                } else {
                    SetTerrainPathable(x, y, PATHING_TYPE_FLOATABILITY, true);
                    SetTerrainPathable(x, y, PATHING_TYPE_WALKABILITY, false);
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
        const maxProgress = (-minX + maxX) * (-minY + maxY);

        // Generate underground
        for (let y = minY; y < maxY; y += this.stepOffset) {
            
            let ny = y / maxY;
            for (let x = minX; x < maxX; x += this.stepOffset) {

                let nx = x / maxX;
                // Log.Info("before getting height for ", x, y);
                let height = this.cavernNoise.getDepthValue((x - minX)/(maxX-minX), (y - minY)/(maxY-minY));
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