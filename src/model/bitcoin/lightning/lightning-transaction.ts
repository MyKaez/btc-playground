import { ILightningNode, ILightningChannel } from ".";

export interface ILightningTransaction {
    from: ILightningNode;
    to: ILightningNode;
    sats: number;
    liquidity: number;
    usedRoute: ILightningChannel[];
    firstChannel: ILightningChannel;
}