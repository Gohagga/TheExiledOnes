import { IEnumUnitService } from "services/enum-service/IEnumUnitService";
import { Point } from "w3ts";

export class EnemyGenerator {

    private minDistance = 800;

    constructor(
        private readonly enumUnitService: IEnumUnitService
    ) {
        
    }

    generateUndergroundEnemies(spawnPoints: { x: number, y: number }[]) {
        for (let i = 0; i < spawnPoints.length; i++) {

            let p = spawnPoints[i];
            // Check if nearby are enemy units
            let nearbyUnits = this.enumUnitService.EnumUnitsInRange(new Point(p.x, p.y), this.minDistance);
            if (nearbyUnits.length == 0) {
                // Spawn a camp
                CreateUnit(Player(11), FourCC('nspb'), p.x, p.y, 0);
                CreateUnit(Player(11), FourCC('nspb'), p.x, p.y, 0);
                CreateUnit(Player(11), FourCC('nspb'), p.x, p.y, 0);
            }
        }
    }
}