// import { Log } from "log/Log";
// import { Agent } from "./Agent";

// export class AiController {

//     private updatedAgents: Agent[] = [];
//     private lastIndex = 0;

//     constructor() {
        
//     }

//     UpdateAgents() {

//         for (let i = this.updatedAgents.length - 1; i >= 0; i--) {

//             let agent = this.updatedAgents[i];

//             if (agent.ExecuteAction()) {
//                 agent.CalculateNextAction();
//             }

//             if (agent.deleted) {
//                 Log.info(i, 'AGENT DESTROYED')
//                 this.updatedAgents[i] = this.updatedAgents[this.lastIndex--];
//                 this.updatedAgents.pop();
//                 // delete this.agents[agent.id];
//             }
//         }
//     }
// }