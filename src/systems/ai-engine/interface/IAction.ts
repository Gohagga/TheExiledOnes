export interface IAction {

    /**If returns true, it means the action is done. If false, it means it is not done. */
    Execute(context: any): boolean;

    Cancel?: (context: any) => void;
}
