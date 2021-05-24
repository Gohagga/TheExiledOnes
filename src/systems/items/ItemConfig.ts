import { Material } from "systems/crafting/Material";

export interface ItemConfig {

    name?: string,
    tooltip?: string,
    itemTypeId: number,
    material?: Material,
}