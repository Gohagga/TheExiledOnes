import { IAction } from "./IAction";

export interface IBehavior {

    GetNextAction(): IAction
    
}