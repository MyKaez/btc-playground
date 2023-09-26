import { AnimHelper, Vector } from "src/model/anim";
import { StringHelper } from "src/model/text";
import { VisualizedPin } from "./visualized-pin";
import { VisualizedNode } from "./visualized-node";
import { VisualizedNodeRelation } from "./visualized-node-relation";
import { NodeCanvas } from "./node-canvas";
import { ArrayHelper } from "src/model/collections";
import { CanvasElement } from "./canvas-element";

export class NodeModelAnimator {
    static readonly nodeSize = 80;
    static readonly pinSize = 20;
    static readonly relationSize = 100;

    constructor(public size = new Vector(0,0), public offset = new Vector(0,0)) {

    }    

    updateNodeCount(nodeCount: number): NodeCanvas {
        const colors = ArrayHelper.selectFor(nodeCount).map(i => AnimHelper.generateColor());
        const nodeTexts = ArrayHelper.selectFor(nodeCount).map(i => String.fromCharCode(i + 64 + 1));
        let canvas = new NodeCanvas(
            [], // nodes
            [], // rels
            [], // pins
            this.size
        );

        canvas.nodes = ArrayHelper.selectFor(nodeCount).map(i => {
            return {
                color: AnimHelper.getColorCssString(colors[i]),
                textColor: AnimHelper.getColorCssString(AnimHelper.convertToGrayscale(AnimHelper.getContrast(colors[i]))),
                connections: [],
                pins: [],
                size: 80 + "px",
                text: nodeTexts[i],
                liquidity: 0,
                x: 0,
                y: 0,
                id: StringHelper.createUiId()
            };
        });

        //canvas.createRelations();

        return canvas;
    }

    static getVector(element: CanvasElement): Vector {
        return new Vector(element.x, element.y);
    }

    static getSizeVector(): Vector {
        return new Vector(this.nodeSize, this.nodeSize);
    }
}