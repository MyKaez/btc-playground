import { Injectable } from "@angular/core";
import { Interval } from "./types";

@Injectable()
export class BlockSizeService {
    get blockTimeInSeconds(): number {
        return 600;
    }
    get blockSizeInBytes(): number {
        return 1_000_000;
    }
    blocksPer(amount: number, interval: Interval): number {
        if (interval > Interval.Second) {
            amount *= 60;
        }
        if (interval > Interval.Minute) {
            amount *= 60;
        }
        if (interval > Interval.Hour) {
            amount *= 24;
        }
        if (interval === Interval.Day) {
            amount *= 7;
        }
        if (interval === Interval.Year) {
            amount *= 355.75;
        }

        return amount / this.blockTimeInSeconds;
    }

    blockSizeInBytesPer(amount: number, interval: Interval): number {
        return this.blocksPer(amount, interval) * this.blockSizeInBytes;
    }
}