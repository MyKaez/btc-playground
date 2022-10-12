import { CanvasElement } from "./canvas-element";
import { VisualizedNode } from "./visualized-node";
import { VisualizedNodeRelation } from "./visualized-node-relation";

export interface VisualizedPin extends CanvasElement {
    id?: number;
    parent: VisualizedNode;
    relation: VisualizedNodeRelation;

    color: string;
    clicked?: boolean;
}