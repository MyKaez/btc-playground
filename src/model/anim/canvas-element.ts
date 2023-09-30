import { Vector } from "./vector";

export interface CanvasElement {
    x: number;
    y: number;
    
    size?: Vector;
    xPx?: string;
    yPx?: string;
}