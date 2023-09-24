import { CanvasElement } from "./canvas-element";
import { VisualizedNodeRelation } from "./visualized-node-relation";
import { VisualizedPin } from "./visualized-pin";

export interface VisualizedNode extends CanvasElement {
    id?: number;
    text: string;

    liquidity: number;

    connections: VisualizedNodeRelation[];
    pins: VisualizedPin[];    

    color: string;
    textColor: string;
}