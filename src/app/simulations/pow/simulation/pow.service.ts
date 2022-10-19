import { PowHash } from "./interfaces";
import { createBlockId } from "../../../shared/helpers/block";
import { calculateProbability, calculateDifficulty, calculateHashDetails, calculateHexaDecimalFormula } from "../../../shared/hash.methods";
import { Injectable } from "@angular/core";

@Injectable()
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
        const res: string[] = [];
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

    get expectedDuration(): string {
        let stringify = (val: number) => val.toString().padStart(2, '0');
        let time = this.totalHashRate * this.blockTime / this.hashRate;
        let minutes = Math.trunc(time / 60);
        let seconds = Math.round(time % 60);
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        if (minutes < 60) {
            return `${stringify(minutes)}:${stringify(seconds)} Minuten`;
        }
        let hours = Math.trunc(minutes / 60);
        minutes = Math.round(time % 60);
        if (minutes === 60) {
            minutes = 0;
            hours++;
        }
        if (hours < 24) {
            return `${stringify(hours)}:${stringify(minutes)}:${stringify(seconds)} Stunden`;
        }
        return 'über 24 Stunden';
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