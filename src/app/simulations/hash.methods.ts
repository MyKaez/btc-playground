import { BLOCK_ID_LENGTH } from "../shared/helpers/block";

export function calculateProbability(hashRate: number, blockTime: number) {
    let prob = 1 / (hashRate * blockTime);
    return (prob >= 1) ? 1 : prob;
}

export function calculateDifficulty(probability: number) {
    return 1 / probability;
}

export function calculateHashDetails(probability: number): [leadingZeros: number, probability: number] {
    let leadingZeros = 0;
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

export function calculateHexaDecimalFormula(leadingZeros: number, probability: number) {
    let x = '';
    for (let i = 0; i < leadingZeros; i++) {
        x += '1/16 * ';
    }
    x += probability + '/16';
    return x;
}