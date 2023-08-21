export interface XpaScenario {
    attackingPower: number;
    blocksToComplete: number;
    preminedBlocks: number;
    cancelAttack: number;
    confirmations: number | null;
}

export const createScenario = (attackingPower: number, blocksToComplete: number, preminedBlocks: number,
    cancelAttack: number, confirmations: number) => ({
        attackingPower: attackingPower,
        blocksToComplete: blocksToComplete,
        preminedBlocks: preminedBlocks,
        cancelAttack: cancelAttack,
        confirmations: confirmations
    } as XpaScenario);

export const compareScenario = (left: XpaScenario, right: XpaScenario) => {
    let result = right.attackingPower - left.attackingPower;
    result |= right.blocksToComplete - left.blocksToComplete;
    result |= right.preminedBlocks - left.preminedBlocks;
    result |= right.cancelAttack - left.cancelAttack;
    result |= (right.confirmations || 0) - (left.confirmations || 0);
    return result;
}

export const DOUBLE_SPEND: XpaScenario = {
    attackingPower: 51,
    blocksToComplete: 15,
    preminedBlocks: 0,
    cancelAttack: 2,
    confirmations: 6
}

export const STATE_ATTACK: XpaScenario = {
    attackingPower: 51,
    blocksToComplete: 15,
    preminedBlocks: 0,
    cancelAttack: 3,
    confirmations: 0
}