import { CanvasElement } from "../../model/anim/canvas-element";
import { VisualizedNode } from "./visualized-node";
import { VisualizedNodeRelation } from "./visualized-node-relation";

export interface VisualizedPin extends CanvasElement {
    id?: number;
    parent: VisualizedNode;
    relation: VisualizedNodeRelation;

    color: string;
    borderColor: string;
    clicked?: boolean;
}