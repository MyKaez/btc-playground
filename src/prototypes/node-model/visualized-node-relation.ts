import { VisualizedNode } from "./visualized-node";
import { VisualizedPin } from "./visualized-pin";

export interface VisualizedNodeRelation {
    id?: number;
    first: VisualizedNode;
    last: VisualizedNode;

    pins: VisualizedPin[];

    color: string;
    x: number;
    y: number;
}