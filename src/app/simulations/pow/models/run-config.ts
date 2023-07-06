import { PowConfig } from "./pow-config";

export interface DeterminationRunConfig {
    runId?: string;
    amountOfBlocks: number;
}

export interface RunConfig extends DeterminationRunConfig {
    powConfig: PowConfig;
}