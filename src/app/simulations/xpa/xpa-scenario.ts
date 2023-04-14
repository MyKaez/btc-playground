export interface Scenario {
    blocksToComplete: number;
    attackingPower: number;
    preminedBlocks: number;
    cancelAttack: number;
    confirmations: number | null;
}

export const DOUBLE_SPEND: Scenario = {
    blocksToComplete: 15,
    attackingPower: 51,
    preminedBlocks: 0,
    cancelAttack: 3,
    confirmations: 6
}

export const STATE_ATTACK: Scenario = {
    blocksToComplete: 15,
    attackingPower: 51,
    preminedBlocks: 1,
    cancelAttack: 3,
    confirmations: null
}