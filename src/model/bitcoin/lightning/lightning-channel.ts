import { ILightningNode, ILightningTransaction, NotEnoughLiquidityError } from ".";

export interface ILightningChannel {
    from: ILightningNode;
    to: ILightningNode;
    inboundLiquidity: number;
    outboundLiquidity: number;

    sendSats(origin: ILightningNode, sats: number): ILightningTransaction;
    isTransactionValid(transaction: ILightningTransaction): boolean;
    canSendSats(origin: ILightningNode, sats: number): boolean;
    getTransaction(origin: ILightningNode, sats: number): ILightningTransaction;
    getOppositeNode(origin: ILightningNode): ILightningNode;
}

export class LightningChannel implements ILightningChannel {
    inboundLiquidity: number;
    outboundLiquidity: number;

    constructor(public from: ILightningNode, public to: ILightningNode, private sats: number) {
        this.inboundLiquidity = sats;
        this.outboundLiquidity = 0;
    }

    sendSats(origin: ILightningNode, sats: number): ILightningTransaction {
        let transaction = this.getTransaction(origin, sats);
        if(transaction.liquidity < transaction.sats) throw new NotEnoughLiquidityError("Missing liquidity", transaction);
        
        if(transaction.to === this.from) sats *= -1;
        this.inboundLiquidity += sats;
        this.outboundLiquidity -= sats;
        return transaction;
    }

    canSendSats(origin: ILightningNode, sats: number): boolean {
        let transaction = this.getTransaction(origin, sats);
        return transaction.liquidity >= transaction.sats;
    }

    isTransactionValid(transaction: ILightningTransaction): boolean {
        return transaction.liquidity >= transaction.sats;
    }

    getTransaction(origin: ILightningNode, sats: number): ILightningTransaction {
        if(this.from !== origin && this.to !== origin) throw new Error(`Node ${origin.title} is foreign to this channel.`);
        let currentLiquidity = this.outboundLiquidity;
        let target = this.to;
        if(origin === this.to) {
            currentLiquidity = this.inboundLiquidity;
            target = this.from;  
        }

        return {
            from: origin,
            to: target,
            sats: sats,
            liquidity: currentLiquidity,
            firstChannel: this,
            usedRoute: [this]
        };
    }

    getOppositeNode(origin: ILightningNode): ILightningNode {
        if(this.from !== origin && this.to !== origin) throw new Error(`Node ${origin.title} is foreign to this channel.`)
        return this.from === origin
            ? this.to
            : this.from;
    }
}