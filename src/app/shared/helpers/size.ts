export function calculateSize(bytes: number): Size {
    let sizeInBytes = bytes;
    for (let i in Unit.units) {
        if (bytes < 1_000) {
            return new Size(sizeInBytes, bytes, Unit.units[i]);
        }
        bytes /= 1_000;
    }
    return new Size(sizeInBytes, bytes, Unit.units[Unit.units.length - 1]);
}

export class Size {
    constructor(public bytes: number, public value: number, public unit: Unit) {
    }
    toText(): string {
        return this.value.toFixed(2) + ' ' + this.unit.text;
    }
}

export class Unit {
    private constructor(public multiplicator: number, public text: string) {
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