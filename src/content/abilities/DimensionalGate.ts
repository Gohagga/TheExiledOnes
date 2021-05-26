import { Global } from "config/Config";
import { Log } from "Log";
import { AbilityBase } from "systems/abilities/AbilityBase";
import { BasicAbility } from "systems/abilities/BasicAbility";
import { Wc3BuildingAbility } from "systems/abilities/BuildingAbilityBase";
import { Wc3Ability } from "systems/abilities/Wc3Ability";
import { CraftingManager } from "systems/crafting/CraftingManager";
import { CraftingRecipe } from "systems/crafting/CraftingRecipe";
import { Material } from "systems/crafting/Material";
import { AbilityEvent } from "systems/events/ability-events/event-models/AbilityEvent";
import { IAbilityEventHandler } from "systems/events/ability-events/IAbilityEventHandler";
import { ErrorService } from "systems/ui/ErrorService";
import { OrderId } from "w3ts/globals/order";
import { MapPlayer, Timer, Trigger, Unit } from "w3ts/index";

export interface DimensionalGateAbility extends Wc3BuildingAbility {

    materialAbilities: DgMaterial[],
}

export interface DgMaterial extends Wc3Ability {
    materials: [number, ...(Material | number)[]][],
}

export class DimensionalGate extends AbilityBase {

    public readonly builtUnitId: number;
    private readonly recipe: CraftingRecipe;
    private readonly tooltip: string;

    private matsNeededForWin: number;

    private existingGate: Unit | null = null;

    private abilities: BasicAbility[] = [];
    private recipes: Record<number, CraftingRecipe> = {};
    
    constructor(
        data: DimensionalGateAbility,
        abilityEvent: IAbilityEventHandler,
        craftingManager: CraftingManager,
        private readonly errorService: ErrorService,
        private readonly playersToWin: MapPlayer[],
    ) {
        super({
            codeId: data.buildCodeId,
            name: data.name,
            experience: data.experience,
            extCodeId: data.extCodeId,
            tooltip: data.tooltip
        });
        this.builtUnitId = FourCC(data.builtUnitCodeId);
        this.recipe = craftingManager.CreateRecipe(data.materials);
        this.tooltip = data.tooltip || '';
        this.matsNeededForWin = data.materialAbilities.length;
        
        abilityEvent.OnAbilityEffect(this.id, (e: AbilityEvent) => this.Execute(e));

        let enterTrig = new Trigger();
        enterTrig.registerAnyUnitEvent(EVENT_PLAYER_UNIT_CONSTRUCT_START);
        enterTrig.addAction(() => this.OnStartBuild());

        let finishTrig = new Trigger();
        finishTrig.registerAnyUnitEvent(EVENT_PLAYER_UNIT_CONSTRUCT_FINISH);
        finishTrig.addAction(() => this.OnUnitBuilt());

        for (let a of data.materialAbilities) {
            
            let recipe = craftingManager.CreateRecipe(a.materials);
            a.tooltip = a.tooltip || '' + 'Materials\n' + recipe.costStringFormatted;
            let ab = new BasicAbility(a, abilityEvent);
            this.abilities.push(ab);
            this.recipes[ab.id] = recipe;

            abilityEvent.OnAbilityEffect(ab.id, (e: AbilityEvent) => this.OnMaterialUsed(e));
        }
    }

    OnMaterialUsed(e: AbilityEvent): boolean {
        
        const caster = e.caster;
        const abilityId = e.abilityId;
        const recipe = this.recipes[abilityId];

        if (!recipe) return true;

        let result = recipe.CraftTierInclusive(caster);

        if (result.successful == false) {
            this.errorService.TextTagError(`Missing materials: ${result.errors.join(', ')}`, caster.x, caster.y);
            this.errorService.SoundError();
            return false;
        }

        result.Consume();
        caster.disableAbility(abilityId, true, false);

        // Disable this ability and set check if it's done
        this.matsNeededForWin--;
        if (this.matsNeededForWin == 0) {
            // Win condition
            AddUnitAnimationProperties(caster.handle, 'alternate', false);
            caster.setAnimation('stand work')
            Log.Message("The Dimensional Gate is complete, and the demons are able to return. Congratulations!");
            new Timer().start(5, false, () => {
                
                for (let p of this.playersToWin) {
                    CustomVictoryBJ(p.handle, true, true);
                }
            });
        }

        return true;
    }

    OnStartBuild(): void {
        let unit = Unit.fromEvent();
        if (unit.typeId != this.builtUnitId) return;

        if (this.existingGate) {

            AddUnitAnimationProperties(this.existingGate.handle, 'alternate', false);
            this.existingGate.applyTimedLife(FourCC('B000'), 0.1);
        }
        
        AddUnitAnimationProperties(unit.handle, 'alternate', true);
        this.existingGate = unit;
    }

    OnUnitBuilt(): void {

        let unit = Unit.fromEvent();
        if (unit.typeId != this.builtUnitId) return;

        try {
            for (let a of this.abilities) {
                a.AddToUnit(unit);
            }

        } catch (e) {
            Log.Error(e);
        }
    }
    
    Execute(e: AbilityEvent): boolean {
        
        const caster = e.caster;
        // let result = this.recipe.GetHighestTierMaterials(caster);
        // if (result.successful) {
        //     result.Consume();
        //     return;
        // }

        if (caster.id == Global.soulAnchor.id) caster.removeAbility(this.id);

        // this.errorService.DisplayError(caster.owner, `Missing materials: ${result.errors.join(', ')}`);
        // caster.issueImmediateOrder(OrderId.Stop);
        return true;
    }

    TooltipDescription?: ((unit: Unit) => string) | undefined = undefined;
// `${this.tooltip}\n\nMaterials\n${this.recipe.costStringFormatted}`;
}