import { ResourceItem } from "content/items/ResourceItem";
import { Log } from "Log";
import { PathingService } from "services/PathingService";
import { IItemFactory } from "systems/items/IItemFactory";
import { Random } from "systems/random/Random";
import { Destructable, Rectangle } from "w3ts/index";

export class RandomObjectPlacer {
    
    public readonly logId: number = FourCC('B00L');

    public readonly allTrees: { x: number, y: number }[] = [];
    
    constructor(
        private readonly random: Random,
        private readonly itemFactory: IItemFactory,
    ) {
        
    }

    AddTree(tree: { x: number, y: number }) {
        this.allTrees.push(tree);
    }

    PlaceBranches(worldBranchCount: number) {

        Log.Info("Placing branches...", this.allTrees.length);
        for (let i = 0; i < worldBranchCount; i++) {
            let index = this.random.nextInt(0, this.allTrees.length - 1);

            let tree = this.allTrees[index];
            Log.Info("x, y", tree.x, tree.y);
            let { x, y } = PathingService.instance.GetNearestPoint(tree.x, tree.y);
            // CreateItem(ResourceItem.Branch, x, y);
            let destr = CreateDestructable(this.logId, x, y, math.random() * 140, 1, 0);
        }
    }
}