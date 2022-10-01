import { VisualizedNode } from "./visualized-node";
import { VisualizedNodeRelation } from "./visualized-node-relation";

export interface VisualizedPin {
    id?: number;
    parent: VisualizedNode;
    relation: VisualizedNodeRelation;

    color: string;
    x: number;
    y: number;
    size: number;
}