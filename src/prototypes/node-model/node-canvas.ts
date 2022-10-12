import { ArrayHelper } from "src/model/collections";
import { CanvasElement, VisualizedNode, VisualizedNodeRelation, VisualizedPin } from ".";

export class NodeCanvas {    
    constructor(
        private containerWidth: number,
        private containerHeight: number,
        public nodes: VisualizedNode[] = [],
        public relations: VisualizedNodeRelation[] = [],
        public pins: VisualizedPin[] = []
    ) { 
        //if(nodes.length !== 3) throw new Error("Sorry, we are still missing some cool math to calculate positions and angles for more than 3 nodes");
    }

    movePin(pin: VisualizedPin) {
        let strang = ArrayHelper.swapElement(pin, pin.relation.firstPins, pin.relation.lastPins);
        pin.parent = strang === pin.relation.firstPins ? pin.relation.first : pin.relation.last;

        this.updatePositions();
    }

    
    private nodeSize = 0;
    private nodeMargin = 0;
    private nodePadding = 0;

    private pinSize = 0;
    private pinMargin = 0;
    private pinPadding = 0;
    updatePositions(updateNodes?: boolean) {
        this.nodeSize = 40;
        this.nodeMargin = this.nodeSize / 2 / 5;
        this.nodePadding = this.nodeMargin + this.nodeSize / 2;
    
        this.pinSize = 15;
        this.pinMargin = this.pinSize / 2 / 5;
        this.pinPadding = this.pinMargin + this.pinSize / 2;

        if(updateNodes) this.updateNodePositions();
        this.updatePinPositions();
    }

    private updateNodePositions() {
        // First top center
        this.nodes[0].x = this.containerWidth / 2 - this.nodeSize / 2;
        this.nodes[0].y = this.nodeMargin;

        // Second bottom left
        this.nodes[1].x = this.nodeMargin;
        this.nodes[1].y = this.containerHeight - this.nodeSize - this.nodeMargin;

        // Third bottom right
        this.nodes[2].x = this.containerWidth - this.nodeSize - this.nodeMargin;
        this.nodes[2].y = this.containerHeight - this.nodeSize - this.nodeMargin;

        this.syncCanvasValues(... this.nodes);
    }

    private updatePinPositions() {
        this.relations.forEach(relation => {
            this.updateStrangPosititions(relation.firstPins, relation.first, relation.last);
            this.updateStrangPosititions(relation.lastPins, relation.last, relation.first);
        });
        
        this.syncCanvasValues(... this.pins);
    }

    private updateStrangPosititions(pins: VisualizedPin[], from: VisualizedNode, to: VisualizedNode) { 
        let vector = {
            x: to.x - from.x,
            y: to.y - from.y
        };

        let counter = 0;
        pins.forEach(pin => {
            pin.x = from.x + (vector.x / 3 / pins.length) + (vector.x / 3) * counter;
            pin.x += (pin.x >= 0) ? this.nodePadding : this.nodePadding * -1; // offset

            pin.y = from.y + (vector.y / 3 / pins.length) + (vector.y / 3) * counter;
            pin.y += (pin.y >= 0 ? this.nodePadding : this.nodePadding * -1); // offset
            counter++;
        });
    }

    syncCanvasValues(... elements: CanvasElement[]) {
        elements.forEach(element => {
            element.xPx = Math.floor(element.x)+ "px";
            element.yPx = Math.floor(element.y)+ "px";
        });
    }
}