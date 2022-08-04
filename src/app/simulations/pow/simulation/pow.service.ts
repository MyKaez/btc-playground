import { PowHash } from "./interfaces";
import { createBlockId } from "../../../shared/helpers/block";
import { calculateProbability, calculateDifficulty, calculateHashDetails, calculateHexaDecimalFormula } from "../../../shared/hash.methods";

export class PowService {
    public hashRate: number = 10;
    public blockTime: number = 10;
    public externalHashRate: number = 0;

    get probability(): number {
        if (this.totalHashRate === 0 || this.blockTime === 0) {
            return Number.NaN;
        }
        return calculateProbability(this.totalHashRate, this.blockTime);
    }

    get totalHashRate(): number {
        return this.hashRate + this.externalHashRate;
    }

    get expectedAmountOfBlocks(): number {
        let probability = this.probability;
        if (Number.isNaN(probability)) {
            return Number.NaN;
        }
        return Math.round(calculateDifficulty(probability));
    }

    get expectedAmountOfHashrates(): number {
        return Math.round((this.totalHashRate / this.hashRate) * this.blockTime);
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
        return calculateHexaDecimalFormula(input[0], input[1]);
    }

    get validationInput(): [leadingZeros: number, probability: number] {
        let probability = this.probability;
        return calculateHashDetails(probability);
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

    createHash(leadingZeros: number, probability: number, executedHashrates: number, blockNo: number): PowHash {
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