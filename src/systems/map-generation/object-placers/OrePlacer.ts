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

    placeRocksAndStones(stonePileCount: number, worldRockCount: number) {

        Log.Info("Placing ore...", this.possibleStoneSpots.length);
        for (let i = 0; i < stonePileCount; i++) {
            let index = this.random.nextInt(0, this.possibleStoneSpots.length - 1);

            let p = this.possibleStoneSpots[index];
            Log.Info("x, y", p.x, p.y);
            let { x, y } = PathingService.instance.GetNearestPoint(p.x, p.y);
            // TerrainDeformCrater(x, y, 128, -600, 1, true);
            CreateDestructableZ(OreType.StonePile, x, y, p.z, 270, 1, 0);
            
            // let rocksCount = this.random.nextInt(0, 3);
            // for (let j = 0; j < rocksCount; j++) {
            //     let rx = x + this.random.nextInt(-32, 32);
            //     let ry = y + this.random.nextInt(-32, 32);
            //     let item = CreateItem(ResourceItem.Rock, rx, ry);
            //     rx = GetItemX(item);
            //     ry = GetItemY(item)
            //     rx = rx + (rx - x) * this.random.next(0, 1.5);
            //     ry = ry + (ry - y) * this.random.next(0, 1.5);
            //     SetItemPosition(item, rx, ry);
            // }
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
    }
}