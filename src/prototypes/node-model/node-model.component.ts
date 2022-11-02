import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { Vector } from 'src/model/anim';
import { StringHelper } from 'src/model/text';
import { NodeCanvas, VisualizedNode, VisualizedNodeRelation, VisualizedPin } from "./";

@Component({
    selector: 'node-model',
    templateUrl: 'node-model.component.html',
    styleUrls: ['./node-model.component.scss']
})

export class NodeModelComponent implements OnInit {    
    @ViewChild('canvasToDraw', {static: false}) canvas?: ElementRef<HTMLCanvasElement>;
    
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

    ngOnInit() { 
    }
    
    public context: CanvasRenderingContext2D | null | undefined;

    ngAfterViewInit(): void {
      this.context = this.canvas?.nativeElement.getContext('2d');
    }

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
        let isReversed = (relation.last.x - relation.first.x) > 0;// || (relation.last.y - relation.first.y) > 0; 
        console.log("Take from left", takeFromLeft);
        let firstPins = afflictedPins.splice(0, takeFromLeft);

        relation.firstPins =  isReversed ? afflictedPins : firstPins;
        relation.lastPins = isReversed ? firstPins : afflictedPins;

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

    private mouseDown = false;
    private arrowStart?: Vector;
    onMouseUp(event: Event) {
        this.mouseDown = false;
        this.arrowStart = undefined;
    }

    onMouseMove($event: any) {
        console.log("Moving mouse", $event.clientX);
        if(!this.mouseDown) return;         
        if(!this.arrowStart) {
            this.arrowStart = new Vector($event.clientX, $event.clientY);
            return;
        }

        let ctx = this.context!;
        ctx.beginPath();
        this.canvas_arrow(ctx, this.arrowStart.x, this.arrowStart.y, $event.x, $event.y);
    }

    onMouseDown($event: any) {
        console.log("downing mouse", $event.clientX);
        this.mouseDown = true;
    }

    renderArrow() {
        let ctx = this.context;
        if(!ctx) {
            console.error("No context!");
            return;
        }

        ctx.beginPath();
        this.canvas_arrow(ctx, 10, 30, 200, 150);
        this.canvas_arrow(ctx, 100, 200, 400, 50);
        this.canvas_arrow(ctx, 200, 30, 10, 150);
        this.canvas_arrow(ctx, 400, 200, 100, 50);
        ctx.stroke();
    }   

    canvas_arrow(context: CanvasRenderingContext2D, fromx: number, fromy: number, tox: number, toy: number) {
        var headlen = 10; // length of head in pixels
        var dx = tox - fromx;
        var dy = toy - fromy;
        var angle = Math.atan2(dy, dx);
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        context.moveTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    }
}