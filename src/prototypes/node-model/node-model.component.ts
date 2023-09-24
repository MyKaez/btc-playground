import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { AnimHelper, Vector } from 'src/model/anim';
import { StringHelper } from 'src/model/text';
import { NodeCanvas, NodeModelAnimator, VisualizedNode, VisualizedNodeRelation, VisualizedPin } from "./";
import { distinctUntilChanged, distinctUntilKeyChanged, interval, map, tap } from 'rxjs';

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

    private animator: NodeModelAnimator;
    private updateTicker$ = interval(500);
    private containerSize$ = this.updateTicker$.pipe(
        map(i =>  new Vector(this.elementRef.nativeElement?.clientWidth || 0, this.elementRef.nativeElement?.clientHeight || 0)),
        distinctUntilChanged((previous, current) => !AnimHelper.hasVectorChanged(previous, current)),            
        tap(size => {
            console.log("Updating size of animator", size);
            this.animator.size = size;
            this.nodeCanvas.size = size;
            this.nodeCanvas.updatePositions(true);
            if(this.context)  {
                this.context.canvas.width = size.x;
                this.context.canvas.height = size.y;
            }
        })
    );

    private nodeCount$ = this.updateTicker$.pipe(
        map(i => this.nodeCount),
        distinctUntilChanged(),
        tap(count => {
            console.log("Updating node count", count);
            this.nodeCanvas = this.animator.updateNodeCount(this.nodeCount);
            this.nodeCanvas.updatePositions(true);
        })
    )

    constructor(private elementRef: ElementRef) {
        console.log("element model", elementRef.nativeElement.clientWidth);
        this.animator = new NodeModelAnimator();
        this.nodeCanvas = new NodeCanvas()
    }

    ngOnInit() { 
        //this.animator.size = new Vector(this.elementRef.nativeElement.clientWidth, this.elementRef.nativeElement.clientHeight);
        //this.nodeCanvas = this.animator.updateNodeCount(this.nodeCount);
        this.containerSize$.subscribe();
        this.nodeCount$.subscribe();
        //this.nodeCanvas.updatePositions(true);
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

    private mouseDown = false;
    private arrowStart?: Vector;
    onMouseUp(event: Event) {
        this.mouseDown = false;
        this.arrowStart = undefined;
    }

    onMouseMove($event: any) {
        //console.log("Moving mouse", $event.clientX);
        if(!this.mouseDown) return;         
        if(!this.arrowStart) {
            this.arrowStart = new Vector($event.clientX, $event.clientY);
            return;
        }

        /*let ctx = this.context!;
        ctx.beginPath();
        this.canvas_arrow(ctx, this.arrowStart.x, this.arrowStart.y, $event.x, $event.y);*/
    }

    onMouseDown($event: any) {
        console.log("downing mouse", $event.clientX);
        this.mouseDown = true;
    }

    renderArrow(from: Vector, to: Vector) {
        let ctx = this.context;
        if(!ctx) {
            console.error("No context!");
            return;
        }

        ctx.beginPath();
        
        this.canvas_arrow(ctx, from.x, from.y, to.x, to.y);
        ctx.stroke();
    }   

    onNodeClick(node: VisualizedNode) {
        const otherNode = this.nodeCanvas.nodes.find(n => n != node) || node;
        this.renderArrow(new Vector(node.x, node.y), new Vector(otherNode.x, otherNode.y));
        if(node.liquidity) return;
        node.liquidity = 300;
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
        
        console.log("arrow at", fromx, fromy, tox, toy);
    }
}