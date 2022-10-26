export function calculateSize(bytes: number): Size {
    for (let i in Unit.units) {
        if (bytes < 1_000) {
            return new Size(bytes, Unit.units[i]);
        }
        bytes /= 1_000;
    }
    return new Size(bytes, Unit.units[Unit.units.length - 1]);
}

export class Size {
    size: number;
    sizeUnit: Unit;
    constructor(size: number, sizeUnit: Unit) {
        this.size = size;
        this.sizeUnit = sizeUnit;
    }
    toText(): string {
        return this.size + ' ' + this.sizeUnit.text;
    }
}

export class Unit {
    multiplicator: number;
    text: string;
    private constructor(multiplicator: number, text: string) {
        this.multiplicator = multiplicator;
        this.text = text;
    }
    static readonly bytes = new Unit(0, 'bytes');
    static readonly kiloBytes = new Unit(1, 'kilobytes');
    static readonly megaBytes = new Unit(2, 'megabytes');
    static readonly gigaBytes = new Unit(3, 'gigabytes');
    static readonly teraBytes = new Unit(4, 'terabytes');
    static readonly petaBytes = new Unit(5, 'petabytes');
    static readonly exaBytes = new Unit(6, 'exabytes');
    static readonly units = [
        this.bytes, this.kiloBytes, this.megaBytes, this.gigaBytes, this.teraBytes, this.petaBytes, this.exaBytes
    ];
}