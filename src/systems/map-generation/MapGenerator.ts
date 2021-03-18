import { Log } from "Log";
import { Random } from "systems/random/Random";
import { Rectangle } from "w3ts/index";
import { IHeightNoiseProvider } from "./interfaces/IHeightNoiseProvider";
import { ITreeNoiseProvider } from "./interfaces/ITreeNoiseProvider";

export enum TerrainType {
    Rock = FourCC('Vrck'),
    Grass = FourCC('Vgrs'),
}

export class MapGenerator {
    private readonly generatorThread: LuaThread;
    private readonly random: Random;

    private debt: number = 0;
    private maxDebt: number = 300;
    private stepOffset: number = 128;
    private mapBounds = Rectangle.fromHandle(GetPlayableMapRect());
    private paused = true;
    
    public progress: number = 0;
    public isDone: boolean = false;

    constructor(
        private readonly heightNoise: IHeightNoiseProvider,
        private readonly treeNoise: ITreeNoiseProvider,
        random: Random,
    ) {
        this.generatorThread = coroutine.create(() => this.generateMap());
        this.random = random || new Random();

    }

    private static pause(gen: MapGenerator) {
        gen.paused = true;
        coroutine.yield();
    }

    public resume() {
        if (this.paused) {
            this.debt = 0;
            coroutine.resume(this.generatorThread);
        }
    }

    private generateMap() {{

        Log.info("Started map generation");
        const { maxX, maxY } = this.mapBounds;
        const { minX, minY } = this.mapBounds;
        const maxProgress = (-minX + maxX) * (-minY + maxY);

        FogModifierStart(CreateFogModifierRect(Player(0), FOG_OF_WAR_VISIBLE, GetPlayableMapRect(), true, true));
        // CreateFogModifierRectSimple(Player(0), FOG_OF_WAR_VISIBLE, GetPlayableMapRect(), false);

        Log.info(minX, minY, maxX, maxY, maxProgress);

        // Generate height
        for (let y = minY; y < maxY; y += this.stepOffset) {
            
            let ny = y / maxY;
            for (let x = minX; x < maxX; x += this.stepOffset) {

                let nx = x / maxX;
                let height = this.heightNoise.getHeightValue(nx, ny);
                // height = height * 400 + 64;
                // print("Height: ", height);
                height = 2750 * height + 64;
                TerrainDeformCrater(x, y, this.stepOffset, -height, 1, true);

                this.debt += 2;

                
                this.progress = ((y - minY) * (maxX - minX) + x - minX) / maxProgress;
                ClearTextMessages();
                // Log.info("Progress: ", this.progress);
                
                if (height > 100) {
                        SetTerrainType(x, y, TerrainType.Rock, -1, 1, 0);
                        // SetTerrainPathable(x, y, PATHING_TYPE_WALKABILITY, true);
                    }
                    else if (height > 60)
                        SetTerrainType(x, y, TerrainType.Grass, -1, 1, 0);
                    
                let tree = this.treeNoise.getTreeValue(nx, ny, height).type;
                if (tree > 0) {
                    this.debt += 3;
                    if (this.random.next() <= tree) {

                        let tx = this.random.nextInt(-64, 64) + x;
                        let ty = this.random.nextInt(-64, 64) + y;
                        CreateDestructable(FourCC('LTlt'), tx, ty, 270, this.random.next(0.8, 1.3), 0);
                    }
                }

                if (this.debt >= this.maxDebt)
                    MapGenerator.pause(this);
            }
        }

        this.isDone = true;
    }}
}