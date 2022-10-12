import { CanvasElement } from "./canvas-element";
import { VisualizedNodeRelation } from "./visualized-node-relation";

export interface VisualizedNode extends CanvasElement {
    id?: number;
    text: string;

    connections: VisualizedNodeRelation[];

    color: string;
}