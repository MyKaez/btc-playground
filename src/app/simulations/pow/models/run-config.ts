import { PowConfig } from "./pow-config";

export interface DeterminationRunConfig {
    runId?: string;
    amountOfBlocks: number;
    modifyHash?: (hash: string) => string;
    stopCondition?: () => boolean;
}

export interface RunConfig extends DeterminationRunConfig {
    powConfig: PowConfig;
    startTime: Date;
}