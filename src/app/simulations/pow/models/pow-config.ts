export interface PowConfig {
    secondsUntilBlock: number;
    secondsToSkipValidBlocks: number;
    totalHashRate: number;
    difficulty: number;
    expected: number;
    threshold: string;
}