import { PowBlock } from "./pow.block";
import { BLOCK_ID_LENGTH, createBlockId } from "../helpers/block";

export class PowService {
    public hashRate: number = 10;
    public blockTime: number = 10;

    get probability(): number {
        if (this.hashRate === 0 || this.blockTime === 0) {
            return Number.NaN;
        }
        return 1 / (this.hashRate * this.blockTime);
    }

    get expectedAmountOfBlocks(): number {
        let probability = this.probability;
        if (Number.isNaN(probability)) {
            return Number.NaN;
        }
        return 1 / probability;
    }

    get expectedPrefixes(): string {
        const res = [];
        const input = this.validationInput;
        let x = '';
        for (let i = 0; i < input[0]; i++) {
            x += '0';
        }
        for (let i = 0; i < input[1]; i++) {
            res.push(x + i.toString(16));
        }
        if (res.length === 1) {
            return res[0];
        }
        return res[0] + '-' + res[res.length - 1];
    }

    get hexaDecimalFormula(): string {
        const input = this.validationInput;
        let x = '';
        for (let i = 0; i < input[0]; i++) {
            x += '1/16 * ';
        }
        x += input[1] + '/16';
        return x;
    }

    get validationInput(): [leadingZeros: number, probability: number] {
        let leadingZeros = 0;
        let probability = this.probability;
        for (let i = 0; i < BLOCK_ID_LENGTH; i++) {
            probability = probability * 16;
            if (probability >= 1) {
                break;
            }
            leadingZeros++;
        }
        probability = Math.round(probability);
        return [leadingZeros, probability];
    }

    validate(id: string, leadingZeros: number, probability: number): boolean {
        let zerosOnly = id.substring(0, leadingZeros);
        for (let i = 0; i < leadingZeros; i++) {
            zerosOnly = zerosOnly.replace('0', '');
        }
        if (zerosOnly.length > 0) {
            return false;
        }
        let relevantChar = id.substring(leadingZeros, leadingZeros + 1);
        let hex = '0x' + relevantChar;
        return Number.parseInt(hex) < probability;
    }

    createBlock(leadingZeros: number, probability: number, executedHashrates: number, blockNo: number): PowBlock {
        const id = createBlockId();
        const block = {
            id: id,
            hashRate: executedHashrates,
            difficulty: this.probability,
            serialNo: blockNo,
            isValid: this.probability === 1
                ? true
                : this.validate(id, leadingZeros, probability)
        };
        return block;
    }
}