// import { IAction } from "./interface/IAction";
// import { IBehavior } from "./interface/IBehavior";

// export class Agent {

//     public deleted = false;

//     private context: any;
//     private action: IAction;
//     private behavior: IBehavior;
//     private currentValue: number = 0;

//     public CalculateNextAction() {
//         this.action.Cancel && this.action.Cancel(this.context);
//         this.action = this.behavior.GetNextAction();
//     }

//     public ExecuteAction() {
//         return this.action.Execute(this.context);
//     }

//     public ProposeBehavior(behavior: IBehavior, value: number) {
//         if (this.currentValue > value) return;
//         this.behavior = behavior;
//         this.currentValue = value;
//     }
// }