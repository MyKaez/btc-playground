import { XpaParticipant } from "./xpa-participant";

export interface XpaParticipantView extends XpaParticipant {
    blocks: string;
    stripes: string;
    absoluteLead: number;
    confirmationBoxes?: string;
    leadingBlocks?: string;
    leadingStripes?: string;
}