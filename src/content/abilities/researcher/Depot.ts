import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { BuildingAbilityBase, Wc3BuildingAbility } from "systems/abilities/BuildingAbilityBase";
import { IAbility } from "systems/abilities/IAbility";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { AbilitySlotManager } from "systems/ability-slots/AbilitySlotManager";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { ErrorService } from "systems/ui/ErrorService";
import { Item, Timer, Trigger, Unit } from "w3ts/index";

export class Depot extends BuildingAbilityBase {
    
    private instance: Record<number, { storedItems: Item[], previewItem: Item | null, storedItem: Item | null, max: number }> = {};
    private previewItems: Map<number, Unit> = new Map<number, Unit>();

    constructor(
        data: Wc3BuildingAbility,
        spellbookAbility: IAbility,
        abilityEvent: IAbilityEventHandler,
        slotManager: AbilitySlotManager,
        errorService: ErrorService,
        craftingManager: CraftingManager,
        private readonly hideItemPosition: { x: number, y: number }
    ) {
        super(data, spellbookAbility, abilityEvent, slotManager, errorService,
            craftingManager.CreateRecipe(data.materials || []));
            
        abilityEvent.OnAbilityEffect(this.buildId, (e: AbilityEvent) => this.Execute(e));

        let finishBuilding = new Trigger();
        finishBuilding.registerAnyUnitEvent(EVENT_PLAYER_UNIT_CONSTRUCT_FINISH);
        finishBuilding.addAction(() => this.OnUnitBuilt());


        let t = new Trigger();
        
        t.registerAnyUnitEvent(EVENT_PLAYER_UNIT_PICKUP_ITEM);
        t.addAction(() => {
            let unit = Unit.fromEvent();
            let item = Item.fromEvent();
            if (unit.typeId == FourCC('u000'))
                this.OnItemStore(unit);
            if (this.previewItems.has(item.id) && this.previewItems.get(item.id) != unit)
                this.OnItemRetrieve(item, unit);
        });
    }

    public RequestItem(depot: Unit): Item | null {

        let unitId = depot.id;
        if (unitId in this.instance == false) return null;

        let instance = this.instance[unitId];
        return instance.previewItem;
    }

    OnItemRetrieve(item: Item, hero: Unit) {
        
        let unit = this.previewItems.get(item.id);
        if (!unit) return;

        let instance = this.instance[unit.id];
        let nextPreview = instance.storedItems.pop();
        
        let storedItem = instance.storedItem as Item;
        // if (instance.storedItems.length == 0) {

        // If there is no item to fetch from the store at all
        // This means we just picked up the last item and previewed item is empty.
        if (nextPreview == null) {
            
            storedItem.destroy();
            instance.storedItem = null;
            instance.previewItem = null;
        
        } else if (nextPreview) {

            storedItem.charges = instance.storedItems.length + 1;
            this.SetPreviewItem(unit, item);
            hero.addItem(nextPreview);
        }
    }

    OnUnitBuilt(): void {
        
        let unit = Unit.fromEvent();
        if (unit.typeId != this.builtUnitId) return;
        
        unit.addAbility(FourCC('Amrf'));
        unit.removeAbility(FourCC('Amrf'));
        unit.setflyHeight(100, 0);
        // unit.setVertexColor(255, 255, 255, 120);
        Log.Info("height has been set");
        unit.show = false;
        unit.show = true;

        // Adjust stats etc
        let unitId = unit.id;
        if (unitId in this.instance == false) {
            this.instance[unitId] = {
                storedItems: [],
                previewItem: null,
                storedItem: null,
                max: 24
            }
        }
    }

    Execute(e: AbilityEvent): boolean {
        
        return this.OnBuild(e.caster);
    }

    private lock = false;
    OnItemStore(unit: Unit): void {

        let unitId = unit.id;
        let loaded = Item.fromEvent();

        if (this.lock) return;

        let instance = this.instance[unitId];
        if (instance == null) return unit.removeItem(loaded);

        if (instance.previewItem && loaded.id == instance.previewItem.id || instance.storedItems.length + 1 >= instance.max) {
            unit.removeItem(loaded);
            return;
        }

        if (instance.storedItem == null) {
            
            let fake = new Item(loaded.typeId, 0, 0);
            
            this.SetPreviewItem(unit, loaded);
            
            UnitRemoveItemFromSlot(unit.handle, 0);
            
            instance.storedItem = fake;

            this.lock = true;
            unit.addItem(fake);
            this.lock = false;
            
            // let fake = unit.getItemInSlot(0);
            fake.charges = 1;
            fake.setDroppable(false);


        } else if (
            instance.storedItem.id != loaded.id &&
            instance.storedItem.typeId == loaded.typeId
        ) {

            this.StorePreviewItem(unit);
            this.SetPreviewItem(unit, loaded);
            instance.storedItem.charges = instance.storedItems.length + 1;
        } else {
            unit.removeItem(loaded);
        }
    }

    private StorePreviewItem(unit: Unit) {
        let instance = this.instance[unit.id];

        if (instance.previewItem) {
            this.previewItems.delete(instance.previewItem.id);
            instance.previewItem.setPosition(this.hideItemPosition.x, this.hideItemPosition.y);
            instance.storedItems.push(instance.previewItem);
        }
    }

    private SetPreviewItem(unit: Unit, item: Item) {

        let instance = this.instance[unit.id];

        this.previewItems.set(item.id, unit);
        item.setPosition(unit.x, unit.y);
        instance.previewItem = item;
    }

    TooltipDescription = undefined;
}

