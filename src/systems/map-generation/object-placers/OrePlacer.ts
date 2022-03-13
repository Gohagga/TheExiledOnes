import { OreType } from "config/OreType";
import { ResourceItem } from "content/items/ResourceItem";
import { Log } from "Log";
import { PathingService } from "services/PathingService";
import { IItemFactory } from "systems/items/IItemFactory";
import { Random } from "systems/random/Random";
import { Rectangle } from "w3ts/index";
import { HeightBuilder } from "../builders/HeightBuilder";

export class OrePlacer {
    
    public readonly possibleStoneSpots: { x: number, y: number, z: number }[] = [];
    public readonly possibleQuarrySpots: { x: number, y: number, z: number }[] = [];

    constructor(
        private readonly random: Random,
        private readonly region: Rectangle,
        private readonly heightBuilder: HeightBuilder,
        private readonly itemFactory: IItemFactory,
    ) {
        
    }

    AddPossibleStoneSpot(point: { x: number, y: number, z: number }) {
        // Log.Info("Registered spot");
        this.possibleStoneSpots.push(point);
    }

    AddPossibleQuarrySpot(point: { x: number, y: number, z: number }) {
        // Log.Info("Registered spot");
        this.possibleQuarrySpots.push(point);
    }

    placeRocksAndStones(stonePileCount: number, worldRockCount: number, quarrySpot: number) {

        Log.Info("Placing ore...", this.possibleStoneSpots.length);
        for (let i = 0; i < stonePileCount; i++) {
            let index = this.random.nextInt(0, this.possibleStoneSpots.length - 1);

            let p = this.possibleStoneSpots[index];
            Log.Info("x, y", p.x, p.y);
            let { x, y } = PathingService.instance.GetNearestPoint(p.x, p.y);
            // TerrainDeformCrater(x, y, 128, -600, 1, true);
            CreateDestructableZ(OreType.StonePile, x, y, p.z, 270, 1, GetRandomInt(0, 5));
            
            let rocksCount = this.random.nextInt(1, 3);
            for (let j = 0; j < rocksCount; j++) {
                let rx = x + this.random.nextInt(-32, 32);
                let ry = y + this.random.nextInt(-32, 32);
                let item = this.itemFactory.CreateItemByType(ResourceItem.Stone, rx, ry);
            }
            worldRockCount -= rocksCount;
        }

        let { minX, maxX, minY, maxY } = this.region;
        for (let i = 0; i < worldRockCount; i++) {

            let x = this.random.nextInt(minX, maxX);
            let y = this.random.nextInt(minY, maxX);
            if (this.heightBuilder.getHeight(x, y) >= 200) {
                i--;
            } else {
                this.itemFactory.CreateItemByType(ResourceItem.Stone, x, y);
            }
        }

        for (let i = 0; i < quarrySpot && i < this.possibleQuarrySpots.length; i++) {
            let index = this.random.nextInt(0, this.possibleQuarrySpots.length - 1);

            let p = this.possibleQuarrySpots[index];
            let { x, y } = PathingService.instance.GetNearestPoint(p.x, p.y);

            if (this.heightBuilder.getHeight(x, y) <= 330)
                CreateDestructableZ(OreType.StoneQuarry, x, y, p.z - 150, 270, 2.5, GetRandomInt(0, 5));
            else
                i--;
        }
    }
}