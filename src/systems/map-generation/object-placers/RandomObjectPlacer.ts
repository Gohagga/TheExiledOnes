import { ResourceItem } from "content/items/ResourceItem";
import { Log } from "Log";
import { PathingService } from "services/PathingService";
import { Random } from "systems/random/Random";
import { Destructable, Rectangle } from "w3ts/index";

export class RandomObjectPlacer {
    
    public readonly allTrees: { x: number, y: number }[] = [];
    
    constructor(
        private readonly random: Random
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
            CreateItem(ResourceItem.Branch, x, y);
        }
    }
}