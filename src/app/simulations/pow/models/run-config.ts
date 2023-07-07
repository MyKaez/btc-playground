import { PowConfig } from "./pow-config";

export interface DeterminationRunConfig {
    runId?: string;
    amountOfBlocks: number;
    stopCondition: () => boolean;
    modifyHash?: (hash: string) => string;
}

export interface RunConfig extends DeterminationRunConfig {
    powConfig: PowConfig;
}