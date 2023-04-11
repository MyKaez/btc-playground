import { NormalizedHashrate } from "src/model/bitcoin";

export interface XpaParticipant {
    title: string;
    minedBlocks: number;
    blocksInLead: number;
    hashrate: NormalizedHashrate;
    hashrateTitle: string;
    confirmations: number;
}