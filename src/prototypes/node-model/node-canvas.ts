import { ArrayHelper } from "src/model/collections";
import { CanvasElement, VisualizedNode, VisualizedNodeRelation, VisualizedPin } from ".";
/* see: http://victorjs.org/ */
const Victor = require("victor");

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

        console.log("nodeSize", this.nodeSize);
        console.log("nodeMargin", this.nodeMargin);
        console.log("nodePadding", this.nodePadding);
        console.log("pinSize", this.pinSize);
        console.log("pinMargin", this.pinMargin);
        console.log("pingPadding", this.pinPadding);

        if(updateNodes) {
            this.updateNodePositions();
            this.updateRelationPositions();
        }

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
            this.updateStrangPosititions(relation.lastPins, relation.last, relation.first, true);
        });
        
        this.syncCanvasValues(... this.pins);
    }

    private updateRelationPositions() {
        this.relations.forEach(relation => {
            let betweenBothNodes = new Victor((relation.first.x + relation.last.x) / 2, (relation.first.y + relation.last.y) / 2);
            relation.x = betweenBothNodes.x;
            relation.y = betweenBothNodes.y;
        });

        this.syncCanvasValues(... this.relations);
    }

    private updateStrangPosititions(pins: VisualizedPin[], from: VisualizedNode, to: VisualizedNode, invert = false) { 
        let vector = new Victor(to.x - from.x, to.y - from.y);
        let absoluteVector = vector.clone();
        //console.log("From vector", vector.x, vector.y);
        let offset: any = null;// new Victor(this.nodePadding, this.nodePadding);
        vector.normalize();
        //console.log("Normalized", vector.x, vector.y);
        //vector.multiply(new Victor(this.pinPadding, this.pinPadding));


        let counter = 0;
        if(invert)  pins = [... pins].reverse();

        pins.forEach(pin => {
            let pinVector = vector.clone();
            //console.log("cloned", pinVector.x, pinVector.y);
            let elementFactor = (this.pinSize * 1.5) * counter;
            //if(elementFactor === 0) pinVector = new Victor(0,0);
            pinVector.multiply(new Victor(elementFactor, elementFactor));

            if(!offset) {
                offset = this.getNodeCenter(from, this.nodeSize);
                //console.log("Got center", offset.x, offset.y);
                offset = offset.add(new Victor(vector.x * this.nodeSize, vector.y * this.nodeSize));
                offset = offset.subtract(new Victor(from.x, from.y));
                //console.log("Got offset", offset.x, offset.y);
            }

            pin.x = from.x + offset.x + pinVector.x;
            pin.y = from.y + offset.y + pinVector.y;
            //console.log("Set vector", pinVector.x, pinVector.y);

            counter++;
        });
    }

    private getNodeCenter(node: VisualizedNode, nodeSize: number): any {
        return new Victor(node.x + nodeSize / 2, node.y + nodeSize / 2);
    }

    syncCanvasValues(... elements: CanvasElement[]) {
        elements.forEach(element => {
            element.xPx = Math.floor(element.x)+ "px";
            element.yPx = Math.floor(element.y)+ "px";
        });
    }
}