import { VisualizedNode, VisualizedNodeRelation, VisualizedPin } from ".";

export class NodeCanvas {
    
    constructor(
        private containerWidth: number,
        private containerHeight: number,
        private nodes: VisualizedNode[] = [],
        private relations: VisualizedNodeRelation[] = [],
        private pins: VisualizedPin[] = [],
    ) { 
        if(nodes.length !== 3) throw new Error("Sorry, we are still missing some cool math to calculate positions and angles for more than 3 nodes");
    }

    
}