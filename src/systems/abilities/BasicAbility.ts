import { Unit } from "w3ts/index";
import { AbilityBase } from "./AbilityBase";
import { Wc3Ability } from "./Wc3Ability";

export class BasicAbility extends AbilityBase {

    constructor(data: Wc3Ability) {
        super(data);

        if (data.tooltip) {
            let tooltip = data.tooltip;
            this.TooltipDescription = () => tooltip;
        }
    }

    TooltipDescription?: (unit: Unit) => string;
}