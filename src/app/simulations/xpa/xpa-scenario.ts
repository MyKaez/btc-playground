export interface XpaScenario {
    blocksToComplete: number;
    attackingPower: number;
    preminedBlocks: number;
    cancelAttack: number;
    confirmations: number | null;
}

export const DOUBLE_SPEND: XpaScenario = {
    blocksToComplete: 15,
    attackingPower: 51,
    preminedBlocks: 0,
    cancelAttack: 2,
    confirmations: 6
}

export const STATE_ATTACK: XpaScenario = {
    blocksToComplete: 15,
    attackingPower: 51,
    preminedBlocks: 1,
    cancelAttack: 3,
    confirmations: 0
}