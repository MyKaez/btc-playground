import { ILightningChannel, LightningChannel, NotEnoughLiquidityError } from ".";

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

        let matchingRoute = this.findTransactionRoute(to, satAmount, this);
        if(!matchingRoute) throw new NotEnoughLiquidityError(`No route could satisfy ${satAmount} sats to node ${to.title}`);
        return matchingRoute;
    }

    routeTransaction() {

    }

    private findTransactionRoute(to: ILightningNode, satAmount: number, currentNode: ILightningNode, currentChannel?: ILightningChannel, previousRoute?: ILightningChannel[]): ILightningChannel[] | null {        
        let route = previousRoute ? [... previousRoute] : [];
        let nextNode = currentNode;
        if(currentChannel) {
            let transaction = currentChannel.getTransaction(currentNode, satAmount);
            if(!currentChannel.isTransactionValid(transaction)) return [];

            route.push(currentChannel);
            let nextNode = currentChannel.getOppositeNode(currentNode);
            if(nextNode == to) return route;
        }

        let matchingRoutes = nextNode.channels.map(c => this.findTransactionRoute(to, satAmount, nextNode, c, route));
        matchingRoutes = matchingRoutes.filter(r => r);
        matchingRoutes.sort((firstRoute, secondRoute) => firstRoute!.length - secondRoute!.length);
        return matchingRoutes.length ? matchingRoutes[0] : null;
    }
}