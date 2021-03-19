import { Log } from "Log";
import { Random } from "systems/random/Random";

type Point = {
    x: number,
    y: number
}

export class PoissonDisk {

    constructor(
        private readonly random: Random
    ) {
    }

    generate(
        width: number,
        height: number,
        pointsCount: number,
        getMinDistance: (x: number, y: number) => number,
        maxMinDistance: number,

        minX: number,
        minY: number,
    ) {
        const cellSize = maxMinDistance * 0.714;
        const cellWidth = math.floor(width / cellSize);
        const cellHeight = math.floor(width / cellSize);

        // Create grid
        const grid: Point[] = [];
        
        const processList: Point[] = [];
        const samplePoints: Point[] = [];

        
        let firstPoint: Point =
        {
            x: this.random.nextInt(0, width),
            y: this.random.nextInt(0, height)
        }
        
        //update containers
        const pIndex = PoissonDisk.imageToGrid(firstPoint, cellSize);
        grid[pIndex.y * cellWidth + pIndex.x] = firstPoint;
        processList.push(firstPoint);
        samplePoints.push(firstPoint);

        // Generate other points from points in queue
        while (processList.length > 0) {
            let point = processList.pop();

            Log.info(point?.x, point?.y);
            if (!point) continue;

            let minDistance = getMinDistance(point.x, point.y);
            Log.info("minDistance", minDistance);

            for (let i = 0; i < pointsCount; i++) {
                Log.info("i", i);
                let newPoint = this.generateRandomPointAround(point, minDistance);
                Log.info("newPoint: ", newPoint.x, newPoint.y);

                // check that the point is in the image region
                // and no points exists in the point's neighbourhood
                if (point.x <= 0 || point.y <= 0 || point.x >= width || point.y >= height)
                    continue;

                Log.info("Within bounds");

                if (!PoissonDisk.inNeighbourhood(grid, newPoint, minDistance, cellSize, cellWidth)) {
                    // update containers
                    processList.push(newPoint);
                    samplePoints.push(newPoint);
                    let gridIndex = PoissonDisk.imageToGrid(newPoint, cellSize);
                    let pointIndex = gridIndex.y * cellWidth + gridIndex.x;
                    grid[pointIndex] =  newPoint;

                    Log.info("Placing tree at ", newPoint.x + minX, newPoint.y + minY);
                    CreateDestructable(FourCC('LTlt'), newPoint.x + minX, newPoint.y + minY, 270, this.random.next(0.8, 1.3), 0);


                    coroutine.yield();
                }
            }
        }

        return samplePoints;
    }

    static inNeighbourhood(grid: Point[], point: Point, minDistance: number, cellSize: number, cellWidth: number) {

        let gridPoint = this.imageToGrid(point, cellSize);
        Log.info("gridPoint", gridPoint.x, gridPoint.y);
        Log.info("cellWidth", cellWidth);
        let pointIndex = gridPoint.y * cellWidth + gridPoint.x;

        Log.info("pointIndex", pointIndex);

        let neighbouringPointIndices = [
            pointIndex,
            pointIndex + 1,                 // ir
            pointIndex - 1,                 // il
            pointIndex + cellWidth,         // it
            pointIndex - cellWidth,         // ib
            pointIndex + 1 + cellWidth,     // itr
            pointIndex - 1 + cellWidth,     // itl
            pointIndex + 1 - cellWidth,     // ibr
            pointIndex - 1 - cellWidth,     // ibl
        ]
        
        let minDistSquared = minDistance * minDistance;
        for (let index of neighbouringPointIndices) {
            let np = grid[index];
            if (np) {
                let dist = (np.x-point.x)*(np.x-point.x) + (np.y-point.y)*(np.y-point.y);
                Log.info("Distance", dist, "against", minDistSquared);

                if ((np.x-point.x)*(np.x-point.x) + (np.y-point.y)*(np.y-point.y) < minDistSquared) {
                    Log.error("too close");
                    return true
                }
            }
        }

        return false
    }

    static imageToGrid(point: Point, cellSize: number)
    {
        const gridX = math.floor(point.x / cellSize);
        const gridY = math.floor(point.y / cellSize);
        return {
            x: gridX,
            y: gridY
        };
    }

    generateRandomPointAround(point: Point, minDistance: number)
    { 
        // non-uniform, favours points closer to the inner ring, leads to denser packings
        let r1 = this.random.next(); //random point between 0 and 1
        let r2 = this.random.next();
        // random radius between minDistance and 2 * minDistance
        let radius = minDistance * (r1 + 1);
        // random angle
        let angle = 2 * math.pi * r2;
        // the new point is generated around the point (x, y)
        let newX = point.x + radius * math.cos(angle);
        let newY = point.y + radius * math.sin(angle);
        return { x: newX, y: newY };
    }
}