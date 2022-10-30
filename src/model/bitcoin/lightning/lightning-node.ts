import { ILightningChannel, LightningChannel } from ".";

export interface ILightningNode {
    title: string;
    channels: ILightningChannel[];

    openChannel: (to: ILightningNode, sats: number) => ILightningChannel;
}

export class LightningNode implements ILightningNode {
    title = "LightningNode";
    channels:ILightningChannel[] = [];

    openChannel(to: ILightningNode, sats: number): ILightningChannel {
        let channel = new LightningChannel(this, to, sats);

        this.channels.push(channel);
        to.channels.push(channel);
        return channel;
    }

    getTransactionRoute(to: ILightningNode, satAmount: number): ILightningChannel[] {
        let directChannel = this.channels.find(c => c.from === to || c.to ===  to);
        if(directChannel) return [directChannel];

        // TODO: Find valid route to target
        return [];
    }

    routeTransaction() {

    }

    private iterateTransactionRoute() {

    }
}