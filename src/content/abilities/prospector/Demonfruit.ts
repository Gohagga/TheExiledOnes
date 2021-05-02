import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { CraftingRecipe } from "systems/crafting/CraftingRecipe";
import { CraftingResult } from "systems/crafting/CraftingResult";
import { Material } from "systems/crafting/Material";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { IItemFactory } from "systems/items/IItemFactory";
import { ErrorService } from "systems/ui/ErrorService";
import { Destructable, Item, Rectangle, Timer, Trigger, Unit } from "w3ts/index";

export interface DemonfruitAbility extends Wc3Ability {
    harvestUnitCode: string,
    harvestOrder: string,
    fruitItemId: number,
    productionInterval: number,
    recipe1: [number, ...(Material | number)[]][],
    // recipe2: [number, ...(Material | number)[]][],
}

export class Demonfruit extends AbilityBase {
    
    private harvestUnitId: number;
    private harvestOrder: number;
    private fruitItemId: number;
    private productionInterval: number;
    private recipe1: CraftingRecipe;
    // private recipe2: CraftingRecipe;
    private readonly tooltip: string;
    private readonly enumRect: Rectangle;

    private treeDeathTrig: Trigger;

    private treeHarvestUnits: Record<number, { unit: Unit, timer: Timer}> = {};

    constructor(
        data: DemonfruitAbility,
        abilityEvent: IAbilityEventHandler,
        craftingManager: CraftingManager,
        private readonly errorService: ErrorService,
        private readonly itemFactory: IItemFactory,
    ) {
        super(data);
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));

        this.harvestUnitId = FourCC(data.harvestUnitCode);
        this.harvestOrder = OrderId(data.harvestOrder);
        this.fruitItemId = data.fruitItemId;
        this.productionInterval = data.productionInterval;
        this.recipe1 = craftingManager.CreateRecipe(data.recipe1);
        // this.recipe2 = craftingManager.CreateRecipe(data.recipe2);
        this.tooltip = data.tooltip || '';
        this.enumRect = new Rectangle(0, 0, 300, 300);

        this.treeDeathTrig = new Trigger();
        // this.treeDeathTrig.registerDeathEvent()
        this.treeDeathTrig.addAction(() => this.OnTreeDeath());

        let orderTrig = new Trigger();
        orderTrig.registerAnyUnitEvent(EVENT_PLAYER_UNIT_ISSUED_ORDER);
        orderTrig.addAction(() => this.OnOrderIssued());
    }

    OnOrderIssued(): void {
        
        Log.Info("Order issued", GetIssuedOrderId());

        if (GetIssuedOrderId() != this.harvestOrder) return;


    }

    OnTreeDeath(): void {
        
        let dest = GetTriggerDestructable();
        if (!dest) return;

        let tree = Destructable.fromHandle(dest);
        
        if (tree.id in this.treeHarvestUnits) {
            let instance = this.treeHarvestUnits[tree.id];
            instance.unit.x = tree.x;
            instance.unit.y = tree.y;
            instance.unit.applyTimedLife(FourCC('B000'), 0.1);
            instance.timer.destroy();
            delete this.treeHarvestUnits[tree.id];
        }
    }

    Execute(e: AbilityEvent): void {
        
        Log.Info("Cast Demonfruit.");
        let caster = e.caster;
        let owner = caster.owner;
        let tree = e.targetDestructable;
        let result: CraftingResult;
        
        if (!tree) return Log.Error("There is no target destructable.");

        if (tree.id in this.treeHarvestUnits) {
            this.errorService.DisplayError(owner, "Tree is already infected.");
            return;
        }

        let point = { x: tree.x, y: tree.y }

        result = this.recipe1.CraftTierInclusive(caster);
        if (result.successful == false) {

            this.errorService.DisplayError(caster.owner, `Missing: ${result.errors.join(', ')}`);
            return;
        }

        result.Consume();
        caster.addExperience(this.experience, true);
        SetBlight(owner.handle, point.x, point.y, 64, true);

        let harvestUnit = new Unit(caster.owner, this.harvestUnitId, tree.x, tree.y, 90);
        harvestUnit.issueTargetOrder(this.harvestOrder, tree);
        harvestUnit.setAnimation('birth');
        harvestUnit.setTimeScale(0.35);

        let instance = {
            unit: harvestUnit,
            timer: new Timer(),
        };
        this.treeHarvestUnits[tree.id] = instance;
        this.treeDeathTrig.registerDeathEvent(tree);
        instance.timer.start(this.productionInterval, true, () => {
            
            // EnumItemsInRect()
            let nearbyFruits = 0;
            let hx = harvestUnit.x;
            let hy = harvestUnit.y;
            this.enumRect.move(hx, hy);
            EnumItemsInRect(this.enumRect.handle, null, () => {

                let item = Item.fromHandle(GetEnumItem());
                if (item.typeId != this.fruitItemId) return;

                let dx = item.x;
                let dy = item.y;
                let distanceSq = (hx-dx)*(hx-dx) + (hy-dy)*(hy-dy);
                if (distanceSq < 10000) {
                    nearbyFruits++;
                }
            });

            // We will not create more than 6 fruits
            if (nearbyFruits >= 6) return;

            let angle = math.random(math.pi*1.1, math.pi*1.9);
            let x = harvestUnit.x + math.cos(angle)*math.random(3, 5)*20;
            let y = harvestUnit.y + math.sin(angle)*math.random(3, 5)*20;
            this.itemFactory.CreateItemByType(this.fruitItemId, x, y);
            owner.setState(PLAYER_STATE_RESOURCE_LUMBER, owner.getState(PLAYER_STATE_RESOURCE_LUMBER) - 1);
        });
    }

    TooltipDescription = (unit: Unit) =>
`${this.tooltip}

Materials
${this.recipe1.costStringFormatted}`;

}