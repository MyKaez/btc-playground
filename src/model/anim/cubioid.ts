import { CanvasElement } from "./canvas-element";
import { Path } from "./path";
import { Vector } from "./vector";

export class Cuboid implements CanvasElement {
    xPx?: string | undefined;
    yPx?: string | undefined;

    constructor(public size: Vector, public x = 0, public y = 0) {}

    getOrigin = () => new Vector(this.x, this.y);

    getRightDirection = () => new Vector(this.size.x, 0);
    getDownDirection = () => new Vector(0, this.size.y);

    getTopLeftOrigin = () => this.getOrigin();
    getTopRightOrigin = this.getOrigin().add(new Vector(this.size.x, 0));
    getBottomLeftOrigin = this.getOrigin().add(new Vector(0, this.size.y));

    getPaths(): Path[] {
        const goRight =
        const goDown = ;

        const atTopLeft = this.origin;
        const atTopRight = this.origin.add(new Vector(this.size.x, 0));
        const atBottomLeft = this.origin.add(new Vector(0, this.size.y));

        return [
            { 
                origin: atTopLeft,
                direction: goRight
            },
            { 
                origin: atTopLeft,
                direction: goDown
            },
            { 
                origin: atTopRight,
                direction: goDown
            },
            { 
                origin: atBottomLeft,
                direction: goRight
            },
        ];
    }
}
