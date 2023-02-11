import { PowHash } from "./pow-interfaces";
import { BLOCK_ID_LENGTH, createBlockId } from "../../../shared/helpers/block";
import {
  calculateDifficulty,
  calculateHashDetails,
  calculateHexaDecimalFormula,
  calculateProbability
} from "../../../shared/hash.methods";
import { Injectable } from "@angular/core";
import { calculateTime } from "src/app/shared/helpers/time";

@Injectable()
export class PowService {
  public hashRate: number = 50;
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
    let time = this.totalHashRate * this.blockTime / this.hashRate;
    return calculateTime(time);
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

  createHash(probability: number, cycle: number, no: number): PowHash {
    const leadingZeros = this.calculateLeadingZeros(probability);
    const id = createBlockId();
    return {
      hash: id,
      cycle: cycle,
      difficulty: this.probability,
      no: no,
      isValid: this.probability === 1
        ? true
        : this.validate(id, leadingZeros, probability)
    };
  }

  calculateLeadingZeros(probability: number) {
    let leadingZeros = 0;
    for (let i = 0; i < BLOCK_ID_LENGTH; i++) {
      probability = probability * 16;
      if (probability >= 1) {
        break;
      }
      leadingZeros++;
    }
    return leadingZeros;
  }
}
