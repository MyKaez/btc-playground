import { Injectable } from "@angular/core";

@Injectable()
export class BlockSizeService {
    get blockTime(): number {
        return 600;
    }
    get blockSize(): number {
        return 1000;
    }
}