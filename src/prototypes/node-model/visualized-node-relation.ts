import { CanvasElement } from "../../model/anim/canvas-element";
import { VisualizedNode } from "./visualized-node";
import { VisualizedPin } from "./visualized-pin";

export interface VisualizedNodeRelation extends CanvasElement {
    id?: number;
    first: VisualizedNode;
    firstPins: VisualizedPin[];

    last: VisualizedNode;
    lastPins: VisualizedPin[];

    color: string;
}