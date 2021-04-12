import { LogColor } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { CraftingRecipe } from "systems/crafting/CraftingRecipe";
import { ForgeManager } from "systems/crafting/ForgeManager";
import { Material } from "systems/crafting/Material";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { IItemFactory } from "systems/items/IItemFactory";
import { ErrorService } from "systems/ui/ErrorService";
import { Color, Item, Unit } from "w3ts/index";

export interface ForgeAbility extends Wc3Ability {
    materials: [number, Material][],
    temperature: number,
}

export class FelSmithing extends AbilityBase {
    
    private readonly temperature: number;
    private readonly recipe: CraftingRecipe;
    private readonly tooltip: string;
    private readonly temperatureColor = new Color(66, 221, 0).code;
    private manacost = 0;
    
    constructor(
        data: ForgeAbility,
        abilityEvent: IAbilityEventHandler,
        craftingManager: CraftingManager,
        private readonly itemFactory: IItemFactory,
        private readonly forgeManager: ForgeManager,
        private readonly errorService: ErrorService,
        private readonly resultItemType: number
    ) {
        super(data);
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));
        this.temperature = data.temperature;
        this.recipe = craftingManager.CreateRecipe(data.materials);

        this.manacost = BlzGetAbilityManaCost(this.id, 0);

        this.tooltip = data.tooltip || '';
    }

    Execute(e: AbilityEvent): void {
        
        const caster = e.caster;

        let forges = this.forgeManager.GetNearbyForges(caster.point);
        if (forges.length == 0) {
            this.errorService.DisplayError(caster.owner, `Must be near a Hell Forge.`);
            caster.mana += this.manacost;
            return;
        }

        let highestTempForge = this.forgeManager.GetHighestTemperatureForge(forges, this.temperature);
        if (!highestTempForge) {
            this.errorService.DisplayError(caster.owner, `Temperature too low. Need at least ${this.temperature}.`);
            caster.mana += this.manacost;
            return;
        }

        let result = this.recipe.CraftTierInclusive(caster);
        if (result.successful == false) {
            this.errorService.DisplayError(caster.owner, `Missing: ${result.errors.join(', ')}`);
            caster.mana += this.manacost;
            return;
        }

        result.Consume();
        
        let item = this.itemFactory.CreateItemByType(this.resultItemType);
        if (!caster.addItem(item))
            item.setPoint(caster.point);
        
    }
    
    TooltipDescription = (unit: Unit) =>
`${this.tooltip}

Hell Forge Temperature: ${this.temperatureColor}${this.temperature}|r
Materials
${this.recipe.costStringFormatted}`;

}