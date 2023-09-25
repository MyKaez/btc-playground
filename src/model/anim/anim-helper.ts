import { Rgba } from "ngx-color-picker";
import { Vector } from "./vector";

export class AnimHelper {
    private static readonly MaxRgbValue = 255;
    private static readonly HalfMaxRgbValue = this.MaxRgbValue / 2;
    public static getContrast(color: Rgba): Rgba {
        return {
            r: this.getContrastValue(color.r),
            g: this.getContrastValue(color.g),
            b: this.getContrastValue(color.b),
            a: 1,
        };
    } 

    /* Selects the middle to the closest end and inverts the result */
    public static getContrastValue(colorPart: number): number {
        const anchor = colorPart > this.HalfMaxRgbValue 
            ? this.MaxRgbValue
            : 0;

        return Math.floor(this.MaxRgbValue - (anchor * 3 + colorPart) / 4);
    }

    public static getColorCssString(color: Rgba, includeAlpha = false): string {
        return includeAlpha 
            ? `rgba(${color.r},${color.g},${color.b},${color.a})`
            : `rgb(${color.r},${color.g},${color.b})`;
    }

    public static convertToGrayscale(color: Rgba) {
        const middleValue = Math.floor((color.r + color.g + color.b) / 3);
        return {
            r: middleValue,
            g: middleValue,
            b: middleValue,
            a: color.a,
        };
    }

    public static generateColor(randomizeAlpha = false): Rgba {
        return {
            r: this.generateColorValue(),
            g: this.generateColorValue(),
            b: this.generateColorValue(),
            a: randomizeAlpha ? Math.random() : 1
        };
    }

    public static generateColorValue(): number {
        return Math.floor(Math.random() * this.MaxRgbValue);
    }

    public static getCenter(position: Vector, size: Vector, fromBottom = false, fromRight = false): Vector {
        //if(fromBottom || fromRight) throw new Error("Other Ancor as top left is not supported, yet");
        size = size.copy();
        if(fromBottom) size.y *= -1;
        if(fromRight) size.x *= -1;

        return position.add(size.divide(2));        
    }

    public static hasVectorChanged(previous: Vector, current: Vector, returnTrueOnZeroSize = false): boolean {
        if(!returnTrueOnZeroSize && (!current.x || !current.y)) return false;
        const hasChanged = !!(current.x - previous.x) || !!(current.y - previous.y);
        return hasChanged;
    }
}