export interface Wc3Ability {
    
    /**Id of wc3 ability. */
    codeId: string,

    /**Id of extended wc3 ability.*/
    extCodeId?: string,

    name: string,

    tooltip?: string,

    experience?: number,

    // icon: string,

    // iconDisabled?: string,
}

export interface Wc3ToggleAbility extends Wc3Ability {
    nameOn: string,
    tooltipOn?: string
}