import { PowHash } from "./pow-interfaces";
import { BLOCK_ID_LENGTH, createBlockId } from "../../../shared/helpers/block";
import { calculateHexaDecimalFormula } from "../../../shared/hash.methods";
import { Injectable } from "@angular/core";

@Injectable()
export class PowService {

  expectedPrefix(probability: number): string {
    const res: string[] = [];
    let x = '';
    for (let i = 0; i < this.calculateLeadingZeros(probability); i++) {
      x += '0';
    }
    for (let i = 0; i < probability; i++) {
      res.push(x + i.toString(16));
    }
    if (res.length === 1) {
      return res[0];
    }
    return res[0] + '-' + res[res.length - 1];
  }

  hexaDecimalFormula(probability: number): string {
    const leadingZeros = this.calculateLeadingZeros(probability);
    return calculateHexaDecimalFormula(leadingZeros, probability);
  }

  createHash(probability: number, cycle: number, no: number): PowHash {
    const leadingZeros = this.calculateLeadingZeros(probability);
    const id = createBlockId();
    return {
      hash: id,
      cycle: cycle,
      difficulty: probability,
      no: no,
      isValid: probability === 1
        ? true
        : this.validate(id, leadingZeros, probability)
    };
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
