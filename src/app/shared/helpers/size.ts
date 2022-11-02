export function calculateUnit(value: number, unit: UnitOfSize | UnitOfHash): Unit {
    let multi = Math.pow(1000, unit.multiplicator);
    if (multi === 0) {
        multi = 1;
    }
    let sizeInBytes = value * multi;
    const units = unit instanceof UnitOfSize ? UnitOfSize.units : UnitOfHash.units;
    for (let i in units) {
        if (value < 1_000) {
            return new Unit(sizeInBytes, value, units[i]);
        }
        value /= 1_000;
    }
    return new Unit(sizeInBytes, value, units[units.length - 1]);
}

export class Unit {
    constructor(public smallesUnits: number, public value: number, public unit: UnitOfSize | UnitOfHash) {
    }
    toText(): string {
        return this.value.toFixed(2) + ' ' + this.unit.text;
    }
}

export class UnitOfSize {
    private constructor(public multiplicator: number, public text: string) {
    }
    static readonly bytes = new UnitOfSize(0, 'bytes');
    static readonly kiloBytes = new UnitOfSize(1, 'kilobytes');
    static readonly megaBytes = new UnitOfSize(2, 'megabytes');
    static readonly gigaBytes = new UnitOfSize(3, 'gigabytes');
    static readonly teraBytes = new UnitOfSize(4, 'terabytes');
    static readonly petaBytes = new UnitOfSize(5, 'petabytes');
    static readonly exaBytes = new UnitOfSize(6, 'exabytes');
    static readonly units = [
        this.bytes, this.kiloBytes, this.megaBytes, this.gigaBytes, this.teraBytes, this.petaBytes, this.exaBytes
    ];
}
export class UnitOfHash {
    private constructor(public multiplicator: number, public text: string) {
    }
    static readonly hashes = new UnitOfHash(0, 'hashes');
    static readonly kiloHashes = new UnitOfHash(1, 'kilohashes');
    static readonly megaHashes = new UnitOfHash(2, 'megahashes');
    static readonly gigaHashes = new UnitOfHash(3, 'gigahashes');
    static readonly teraHashes = new UnitOfHash(4, 'terahashes');
    static readonly petaHashes = new UnitOfHash(5, 'petahashes');
    static readonly exaHashes = new UnitOfHash(6, 'exahashes');
    static readonly units = [
        this.hashes, this.kiloHashes, this.megaHashes, this.gigaHashes, this.teraHashes, this.petaHashes, this.exaHashes
    ];
}