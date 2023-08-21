import { Rgba } from "ngx-color-picker";

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
}