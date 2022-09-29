import { VisualizedNode } from "./visualized-node";
import { VisualizedNodeRelation } from "./visualized-node-relation";

export interface VisualizedPin {
    parent: VisualizedNode;
    relation: VisualizedNodeRelation;

    color: string;
    x: number;
    y: number;
}