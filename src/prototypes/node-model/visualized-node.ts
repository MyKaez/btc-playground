import { VisualizedNodeRelation } from "./visualized-node-relation";

export interface VisualizedNode {
    id: number;
    text: string;

    connections: VisualizedNodeRelation;

    color: string;
    x: number;
    y: number;
}