import { Vector } from "src/model/anim";
import { ArrayHelper } from "src/model/collections";
import { CanvasElement, NodeModelAnimator, VisualizedNode, VisualizedNodeRelation, VisualizedPin } from ".";
import { StringHelper } from "src/model/text";

export class NodeCanvas {    
    constructor(
        public nodes: VisualizedNode[] = [],
        public relations: VisualizedNodeRelation[] = [],
        public pins: VisualizedPin[] = [],
        public size = new Vector(0,0)
    ) { }

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

        //console.log("nodeSize", this.nodeSize);
        //console.log("nodeMargin", this.nodeMargin);
        //console.log("nodePadding", this.nodePadding);
        //console.log("pinSize", this.pinSize);
        //console.log("pinMargin", this.pinMargin);
        //console.log("pingPadding", this.pinPadding);

        if(updateNodes) {
            this.updateNodePositions();
            this.updateRelationPositions();
        }

        this.updatePinPositions();
    }

    

    createInitialRelations(canvas: NodeCanvas) {
        let combinations: VisualizedNode[][] = [];
        canvas.nodes.forEach(from => {
            canvas.nodes.forEach(to => {
                if (from === to) return;
                if (combinations.some(combination => combination.indexOf(from) >= 0 && combination.indexOf(to) >= 0)) return;
                combinations.push([from, to]);

                this.createRelation(from, to);
            });
        });
    }

    createRelation(from: VisualizedNode, to: VisualizedNode) {
        if(this.relations.some(relation => ArrayHelper.areArraysEqual([relation.first, relation.last], [from, to]))) {
            throw new Error(`Relation with nodes ${from.text} and ${to.text} already exists`);
        }

        let relation: VisualizedNodeRelation = {
            color: "#aad",
            first: from,
            firstPins: [],
            last: to,
            lastPins: [],
            x: 0,
            y: 0,
            id: StringHelper.createUiId()
        };

        let pinCount = Math.random() * 5 + 5;
        for (let i = 0; i < pinCount; i++) {
            let first: VisualizedPin = {
                color: from.color,
                borderColor: from.textColor,
                parent: from,
                relation: relation,
                size: NodeModelAnimator.pinSize + "px",
                x: i * NodeModelAnimator.pinSize,
                y: i * NodeModelAnimator.pinSize,
                id: StringHelper.createUiId()
            };

            let second = {
                ...first,
                parent: to,
                color: to.color,
                borderColor: to.textColor,
                id: StringHelper.createUiId()
            };

            relation.firstPins.push(first);
            relation.lastPins.push(second);
            this.pins.push(first);
            from.pins.push(first);
            this.pins.push(second);
            to.pins.push(first);
        }

        from.connections.push(relation);
        to.connections.push(relation);
        this.relations.push(relation);
    }

    private updateNodePositions() {
        const angleStep = 360 / this.nodes.length;
        let angle = this.getStartAngleInDegrees();

        const originX = this.size.x / 2;
        const originY = this.size.y / 2;
        const radiusX = originX - this.nodeSize;
        const radiusY = originY - this.nodeSize;

        this.nodes.forEach(node => {
            let angleRadians = Math.PI * angle / 180; // degree to radiant
            node.x = originX + radiusX * Math.cos(angleRadians) - this.nodeSize;
            node.y = originY + radiusY * Math.sin(angleRadians) - this.nodeSize;
            angle += angleStep;

            //TODO: this currently wont work consistently for all sizes, as it's based
            // on a circular calculation, not one for an ellipses
            //@see https://stackoverflow.com/questions/13608186/trying-to-plot-coordinates-around-the-edge-of-a-circle
        });

        console.log("Updated positions by ", {
            nodes: this.nodes,
            originX: originX,
            originY: originY,
            radiusX: radiusX,
            radiusY: radiusY,
            angleStep: angleStep,
            angle: angle
        });

        this.syncCanvasValues(... this.nodes);
    }

    private getStartAngleInDegrees(): number {
        const isOddNodesCount = (this.nodes.length % 2) == 1;
        if(isOddNodesCount) return 360 * .75;
        const isVerticalOrientation = (this.size.x / this.size.y) < 0.9;
        if(isVerticalOrientation) return 360 * .75;
        return 0;
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
            let betweenBothNodes = new Vector((relation.first.x + relation.last.x) / 2, (relation.first.y + relation.last.y) / 2);
            relation.x = betweenBothNodes.x;
            relation.y = betweenBothNodes.y;
        });

        this.syncCanvasValues(... this.relations);
    }

    private updateStrangPosititions(pins: VisualizedPin[], from: VisualizedNode, to: VisualizedNode, invert = false) { 
        let vector = new Vector(to.x - from.x, to.y - from.y);        

        let absoluteVector = vector.copy();
        let pinVisualization = this.getPinVisualization(vector.getMagnitude(), pins.length);

        //console.log("From vector", vector.x, vector.y);
        let offset: any = null;// new Vector(this.nodePadding, this.nodePadding);
        vector.normalize();
        //console.log("Normalized", vector.x, vector.y);
        //vector.multiply(new Vector(this.pinPadding, this.pinPadding));


        let counter = 0;
        if(invert)  pins = [... pins].reverse();

        pins.forEach(pin => {
            pin.size = pinVisualization.pinSize + "px";
            let pinVector = vector.copy();
            //console.log("cloned", pinVector.x, pinVector.y);
            let elementFactor = (pinVisualization.pinSize * 1.5) * counter;
            //if(elementFactor === 0) pinVector = new Vector(0,0);
            pinVector = pinVector.multiply(elementFactor);

            if(!offset) {
                offset = this.getNodeCenter(from, this.nodeSize);
                //console.log("Got center", offset.x, offset.y);
                offset = offset.add(new Vector(vector.x * this.nodeSize, vector.y * this.nodeSize));
                offset = offset.subtract(new Vector(from.x, from.y));
                //console.log("Got offset", offset.x, offset.y);
            }

            pin.x = from.x + offset.x + pinVector.x;
            pin.y = from.y + offset.y + pinVector.y;
            //console.log("Set vector", pinVector.x, pinVector.y);

            counter++;
        });
    }

    private getPinVisualization(distanceBetweenNodes: number, pinCount: number): PinVisualization {
        let startPinSize = NodeModelAnimator.pinSize;
        let startRows = 1;
        let shrinkSizeSwitch = true;
        let maxDistance = distanceBetweenNodes / 2 - NodeModelAnimator.relationSize;
        let neededDistance = 0;

        do {
            let distancePerPin = startPinSize * 1.5;
            neededDistance = distancePerPin * pinCount / startRows;
            
            if(shrinkSizeSwitch) startPinSize *= .75;
            else startRows ++;

            shrinkSizeSwitch = !shrinkSizeSwitch;
        } while(neededDistance >= maxDistance);

        return {
            rowCount: startRows,
            pinSize: startPinSize
        };
    }

    private getNodeCenter(node: VisualizedNode, nodeSize: number): Vector {
        return new Vector(node.x + nodeSize / 2, node.y + nodeSize / 2);
    }

    syncCanvasValues(... elements: CanvasElement[]) {
        elements.forEach(element => {
            element.xPx = Math.floor(element.x)+ "px";
            element.yPx = Math.floor(element.y)+ "px";
        });
    }
}

export interface PinVisualization {
    pinSize: number;
    rowCount: number;
}