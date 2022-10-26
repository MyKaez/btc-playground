import { Injectable } from "@angular/core";
import { BLOCK_DURATION_IN_SECONDS, BLOCK_SIZE_LIMIT_IN_BYTES } from "src/app/shared/helpers/block";
import { calculateSize, Size } from "src/app/shared/helpers/size";
import { Interval } from "./types";

@Injectable()
export class BlockSizeService {
    blockTimeInSeconds: number = BLOCK_DURATION_IN_SECONDS;
    size: Size = calculateSize(BLOCK_SIZE_LIMIT_IN_BYTES);

    blocksPer(amount: number, interval: Interval): number {
        if (interval.index > Interval.second.index) {
            amount *= 60;
        }
        if (interval.index > Interval.minute.index) {
            amount *= 60;
        }
        if (interval.index > Interval.hour.index) {
            amount *= 24;
        }
        if (interval.index === Interval.week.index) {
            amount *= 7;
        }
        if (interval.index === Interval.year.index) {
            amount *= 355.75;
        }
        if (interval.index === Interval.decade.index) {
            amount *= 3557.5;
        }

        return amount / this.blockTimeInSeconds;
    }

    blockSizeInBytesPer(amount: number, interval: Interval): number {
        return this.blocksPer(amount, interval) * this.size.bytes;
    }
}