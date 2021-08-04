import { Log } from "Log";
import { Random } from "systems/random/Random";
import { Destructable, Rectangle } from "w3ts";
import { CaveHeightBuilder } from "../builders/CaveHeightBuilder";

export class OreGenerator {

    private queryRubbleRect: Rectangle;
    private queryRubbleSingleRect: Rectangle;
    private offset = 128;

    constructor(
        private random: Random,
        private caveHeightBuilder: CaveHeightBuilder,
        private wallId: number,
        
        // Settings
    ) {
        
        this.queryRubbleRect = new Rectangle(0, 0, 350, 350);
        this.queryRubbleSingleRect = new Rectangle(0, 0, 40, 40);
    }

    generateIronVein(x: number, y: number) {

        print("generating iron vein at ", x, y);
        let context = { count: 0 };
        context.count = this.random.nextInt(2, 5);

        this.furtherIronVein(x, y, context, 0, 0);
    }

    generateCopperVein(x: number, y: number, size?: number) {
        print("generating copper vein at ", x, y);
        let context = { count: 0 };
        context.count = size || this.random.nextInt(1, 4);

        this.furtherCopperVein(x, y, context, 0, 0);
    }

    generateSilverVein(x: number, y: number) {
        print("generating silver vein at ", x, y);

        let context = { count: 0 };
        context.count = this.random.nextInt(1, 3);

        this.furtherSilverVein(x, y, context);        
    }

    private furtherIronVein(x: number, y: number, context: { count: number }, xDir: number, yDir: number) {

        if (context.count < 0) return;

        context.count--;

        // Choose direction to extend to
        xDir = (xDir + 1 + this.random.nextInt(0, 2)) % 3 - 1;
        yDir = (yDir + 1 + this.random.nextInt(0, 2)) % 3 - 1;
        
        let newX = x + this.offset * xDir;
        let newY = y + this.offset * yDir;

        // Find a rubble nearby
        this.queryRubbleSingleRect.move(x, y);
        let dests: destructable[] = [];
        EnumDestructablesInRect(this.queryRubbleSingleRect.handle, null, () => {
            const enumDest = GetEnumDestructable();
            print(GetDestructableName(enumDest));
            if (GetDestructableTypeId(enumDest) == this.wallId)
                dests.push(enumDest);
        });

        if (dests.length == 1) {
            print("Found only one");
            let dest = dests.pop() as destructable;
            newX = GetDestructableX(dest);
            newY = GetDestructableY(dest);

            if (dest) {
                print("Destroying destructable");
                KillDestructable(dest);
            }

        } else if (dests.length == 0) {
            print("Found no rubble");

        } else if (dests.length > 1) {
            print("Found more rubble");
            return;
        }

        try {
            const ironId = FourCC('B0R1');
            print("IRON ID ID ID", ironId);
            CreateDestructableZ(ironId, newX, newY, 100, this.random.next(0, 360), 1.22, this.random.nextInt(0, 6));
            // CreateUnit(Player(0), FourCC('hfoo'), dest.x, dest.y, 0);
            // PanCameraToTimedForPlayer(Player(0), dest.x, dest.y, 0);
            if (context.count >= 2) {
                let oneOrTwo = this.random.nextInt(1, 2);
                if (oneOrTwo = 2) {
                    this.furtherIronVein(newX, newY, context, xDir, yDir);
                }
            }
            if (context.count >= 1)
                this.furtherIronVein(newX, newY, context, xDir, yDir);

        } catch (ex) {
            Log.Error(ex);
        }
        
    }

    private furtherCopperVein(x: number, y: number, context: { count: number }, xDir: number, yDir: number) {

        if (context.count < 0) return;

        context.count--;

        // Choose direction to extend to
        xDir = (xDir + 1 + this.random.nextInt(0, 2)) % 3 - 1;
        yDir = (yDir + 1 + this.random.nextInt(0, 2)) % 3 - 1;
        
        let newX = x + this.offset * xDir;
        let newY = y + this.offset * yDir;

        // Find a rubble nearby
        this.queryRubbleSingleRect.move(x, y);
        let dests: destructable[] = [];
        EnumDestructablesInRect(this.queryRubbleSingleRect.handle, null, () => {
            const enumDest = GetEnumDestructable();
            print(GetDestructableName(enumDest));
            if (GetDestructableTypeId(enumDest) == this.wallId)
                dests.push(enumDest);
        });

        if (dests.length == 1) {
            print("Found only one");
            let dest = dests.pop() as destructable;
            newX = GetDestructableX(dest);
            newY = GetDestructableY(dest);

            if (dest) {
                print("Destroying destructable");
                KillDestructable(dest);
            }

        } else if (dests.length == 0) {
            print("Found no rubble");

        } else if (dests.length > 1) {
            print("Found more rubble");
            return;
        }

        try {
            const copperId = FourCC('B0R2');
            print("IRON ID ID ID", copperId);
            CreateDestructableZ(copperId, newX, newY, 100, this.random.next(0, 360), 1.22, this.random.nextInt(0, 6));
            // CreateUnit(Player(0), FourCC('hfoo'), dest.x, dest.y, 0);
            // PanCameraToTimedForPlayer(Player(0), dest.x, dest.y, 0);
            if (context.count >= 2) {
                let oneOrTwo = this.random.nextInt(1, 2);
                if (oneOrTwo = 2) {
                    this.furtherCopperVein(newX, newY, context, xDir, yDir);
                }
            }
            if (context.count >= 1)
                this.furtherCopperVein(newX, newY, context, xDir, yDir);

        } catch (ex) {
            Log.Error(ex);
        }
        
    }

    private furtherSilverVein(x: number, y: number, context: { count: number }) {

        if (context.count < 0) return;

        context.count--;

        // Find a rubble nearby
        this.queryRubbleRect.move(x, y);
        let dests: destructable[] = [];
        EnumDestructablesInRect(this.queryRubbleRect.handle, null, () => {
            const enumDest = GetEnumDestructable();
            print(GetDestructableName(enumDest));
            if (GetDestructableTypeId(enumDest) == this.wallId)
                dests.push(enumDest);
        });

        if (dests.length == 0) return 0;

        try {
            print("Destroying destructable");
    
            // Pick one, you will surely make a mistake
            let randomIndex = this.random.nextInt(0, dests.length);
            if (!dests[randomIndex]) {
                print("ERROR ERROR NO INDEX");
                return;
            }
            let dest = Destructable.fromHandle(dests[randomIndex]);
            
            // dests.splice(randomIndex, 1);
    
            print(dest.name);
    
            dest.kill();
            const silverId = FourCC('B0R3');
            print("IRON ID ID ID", silverId);
            CreateDestructableZ(silverId, dest.x, dest.y, 100, this.random.next(0, 360), 1.22, this.random.nextInt(0, 6));
            // CreateUnit(Player(0), FourCC('hfoo'), dest.x, dest.y, 0);
            PanCameraToTimedForPlayer(Player(0), dest.x, dest.y, 0);
            if (context.count >= 2) {
                let oneOrTwo = this.random.nextInt(1, 2);
                if (oneOrTwo = 2) {
                    this.furtherSilverVein(dest.x, dest.y, context);
                }
            }
            if (context.count >= 1)
                this.furtherSilverVein(dest.x, dest.y, context);

        } catch (ex) {
            Log.Error(ex);
        }
        
    }
}