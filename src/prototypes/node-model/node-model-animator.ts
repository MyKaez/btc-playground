import { AnimHelper, Vector } from "src/model/anim";
import { StringHelper } from "src/model/text";
import { VisualizedPin } from "./visualized-pin";
import { VisualizedNode } from "./visualized-node";
import { VisualizedNodeRelation } from "./visualized-node-relation";
import { NodeCanvas } from "./node-canvas";
import { ArrayHelper } from "src/model/collections";

export class NodeModelAnimator {
    static readonly nodeSize = 80;
    static readonly pinSize = 20;

    constructor(public size = new Vector(0,0), public offset = new Vector(0,0)) {

    }

    

    createDefaultCanvas(nodeCount: number): NodeCanvas {
        const colors = ArrayHelper.selectFor(nodeCount).map(i => AnimHelper.generateColor());
        const nodeTexts = ArrayHelper.selectFor(nodeCount).map(i => String.fromCharCode(i + 64 + 1));
        let canvas = new NodeCanvas(
            this.size.x,
            this.size.y,
            [], // nodes
            [], // rels
            [] // pins
        );

        for(let i = 0; i < nodeCount; i++) {
            canvas.nodes.push({
                color: AnimHelper.getColorCssString(colors[i]),
                textColor: AnimHelper.getColorCssString(AnimHelper.convertToGrayscale(AnimHelper.getContrast(colors[i]))),
                connections: [],
                pins: [],
                size: 80 + "px",
                text: nodeTexts[i],
                x: 0,
                y: 0,
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