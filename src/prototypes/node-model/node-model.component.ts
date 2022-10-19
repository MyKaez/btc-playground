import { Component, Input, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { StringHelper } from 'src/model/text';
import { NodeCanvas, VisualizedNode, VisualizedNodeRelation, VisualizedPin } from "./";

@Component({
    selector: 'node-model',
    templateUrl: 'node-model.component.html',
    styleUrls: ['./node-model.component.scss']
})

export class NodeModelComponent implements OnInit {    
    @Input("node-count")
    nodeCount = 3;

    @Input("node-canvas")
    nodeCanvas: NodeCanvas;

    @Input("onClickNode")
    onClickNode?: (event: any, node: VisualizedNode) => void;

    @Input("onClickPin")
    onClickPin?: (event: any, VisualizedPin: VisualizedNode) => void;

    constructor() {
        this.nodeCanvas = NodeModelComponent.createDefaultCanvas(this.nodeCount);
        this.nodeCanvas.updatePositions(true);
    }

    ngOnInit() { }

    public clickedPin(pin: VisualizedPin) {
        this.nodeCanvas.movePin(pin);
        pin.clicked = true;
        window.setTimeout(() => pin.clicked = false, 1000);
    }

    updateRelations(event: MatSliderChange, relation: VisualizedNodeRelation) {
        let afflictedPins = [... relation.firstPins, ... relation.lastPins];
        //let possiblePins = [... relation.first.pins, ... relation.last.pins];
        //afflictedPins = afflictedPins.filter()

        let value = event.value || 0;
        let takeFromLeft = Math.floor(value / 100 * afflictedPins.length);
        console.log("Take from left", takeFromLeft);
        let firstPins = afflictedPins.splice(0, takeFromLeft);
        relation.firstPins = firstPins;
        relation.lastPins = afflictedPins;

        console.log("Took from left", firstPins.length);
        console.log("Remaining", relation.lastPins.length);

        this.nodeCanvas.updatePositions(true);
    }

    static createDefaultCanvas(nodeCount: number): NodeCanvas {
        const colors = ["#66f", "#ec3", "#5db"];
        const nodeTexts = ["A", "B", "C"];
        let canvas = new NodeCanvas(
            600,
            400,
            [], // nodes
            [], // rels
            [] // pins
        );

        for(let i = 0; i < nodeCount; i++) {
            canvas.nodes.push({
                color: colors[i % 3],
                connections: [],
                pins: [],
                size: 80 + "px",
                text: nodeTexts[i % 3],
                x: i * 60,
                y: i * 60,
                id: StringHelper.createUiId()
            });
        }

        let combinations: VisualizedNode[][] = [];
        canvas.nodes.forEach(node => {
            canvas.nodes.forEach(other => {                
                if(node === other) return;
                if(combinations.some(combination => combination.indexOf(node) >= 0 && combination.indexOf(other) >= 0)) return;
                combinations.push([node, other]);
            
                let relation: VisualizedNodeRelation = {
                    color: "#aad",
                    first: node,
                    firstPins: [],
                    last: other,
                    lastPins: [],
                    x: 0,
                    y: 0,
                    id: StringHelper.createUiId()
                };
                for(let i = 0; i < 6; i++) {
                    let first: VisualizedPin = {
                        color: "gray",
                        parent: node,
                        relation: relation,
                        size: 20 + "px",
                        x: i * 20,
                        y: i * 20,
                        id: StringHelper.createUiId()
                    };

                    let second = {... first, 
                        parent: other,
                        id: StringHelper.createUiId()
                    };

                    relation.firstPins.push(first);
                    relation.lastPins.push(second);
                    canvas.pins.push(first);
                    node.pins.push(first);
                    canvas.pins.push(second);
                    other.pins.push(first);
                }

                node.connections.push(relation);
                other.connections.push(relation);
                canvas.relations.push(relation);
            });
        });

        return canvas;
    }
}