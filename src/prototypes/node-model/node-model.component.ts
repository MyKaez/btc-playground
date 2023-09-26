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

    private selectedNode?: VisualizedNode;
    onMouseUp($event: any) {
        //this.isDrawMode = false;
        //this.context?.fill();
    }

    onMouseMove($event: any) {
        if(!this.selectedNode) return;     
        const canvasElement = this.canvas?.nativeElement;
        if(!canvasElement) return;

        const canvasRect = canvasElement.getBoundingClientRect();
        
        this.context?.clearRect(0, 0, canvasRect.width, canvasRect.height); 
        this.renderArrow(AnimHelper.getCenter(NodeModelAnimator.getVector(this.selectedNode), NodeModelAnimator.getSizeVector()), 
            new Vector($event.clientX - canvasRect.left, $event.clientY - canvasRect.top));
    }

    onMouseDown($event: any) {
        const canvasElement = this.canvas?.nativeElement;
        if(!canvasElement) return;

        const canvasRect = canvasElement.getBoundingClientRect();
        this.context?.clearRect(0, 0, canvasRect.width, canvasRect.height); 
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
        if(!node.liquidity) {
            node.liquidity = 300;
        }    

        if(!this.selectedNode) this.startDrawing(node);
        else this.endDrawing(node);
    }

    startDrawing(node: VisualizedNode) {
        this.selectedNode = node; 
    }

    endDrawing(node: VisualizedNode) {       
        try { 
            this.nodeCanvas.createRelation(this.selectedNode!, node);
            this.nodeCanvas.updatePositions(true);
        }
        catch(error) {
            console.error(error, this.selectedNode, node);
        }

        this.selectedNode = undefined;
    }

    canvas_arrow(ctx: CanvasRenderingContext2D, fromx: number, fromy: number, tox: number, toy: number) {
        const width = 22;
        var headlen = 10;
        var angle = Math.atan2(toy-fromy,tox-fromx);
        // This makes it so the end of the arrow head is located at tox, toy, don't ask where 1.15 comes from
        tox -= Math.cos(angle) * ((width*1.15));
        toy -= Math.sin(angle) * ((width*1.15));

        
        //starting path of the arrow from the start square to the end square and drawing the stroke
        ctx.beginPath();
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = width;
        ctx.stroke();
        
        //starting a new path from the head of the arrow to one of the sides of the point
        ctx.beginPath();
        ctx.moveTo(tox, toy);
        ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));
        
        //path from the side point of the arrow, to the other side point
        ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),toy-headlen*Math.sin(angle+Math.PI/7));
        
        //path from the side point back to the tip of the arrow, and then again to the opposite side point
        ctx.lineTo(tox, toy);
        ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),toy-headlen*Math.sin(angle-Math.PI/7));

        //draws the paths created above
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.fill();
    }
}