import { VisualizedNode } from "./visualized-node";
import { VisualizedPin } from "./visualized-pin";

export interface VisualizedNodeRelation {
    first: VisualizedNode;
    last: VisualizedNode;

    pins: VisualizedPin[];

    color: string;
    x: number;
    y: number;
}