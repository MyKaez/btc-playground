import { createBlockId } from "../helpers/block";
import { PowService } from "./pow.service"

describe('PowService', () => {
    let service: PowService;

    beforeEach(() => {
        service = new PowService();
        service.blockTime = 10;
        service.hashRate = 10;
    });

    it('No blocktime, no probability', () => {
        service.blockTime = 0;

        expect(Number.isNaN(service.probability)).toBeTrue();
    });

    it('No hashRate, no probability', () => {
        service.hashRate = 0;

        expect(Number.isNaN(service.probability)).toBeTrue();
    });

    it('Probabilty is given', () => {
        expect(service.probability).toBe(1 / (service.blockTime * service.hashRate));
    });

    it('Expected Prefixed are summed up properly', () => {
        service.blockTime = 600;

        expect(service.expectedPrefixes).toBe('0000-000a');
    });

    it('Hexadecimal Formula contains appropriate amount of parts', () => {
        service.blockTime = 600;
        const part = "1/16 *";
        const input = service.validationInput;
        let count = 0;
        let rest = service.hexaDecimalFormula;
        while (rest.indexOf(part) >= 0) {
            count++;
            rest = rest.substring(rest.indexOf(part) + part.length);
        }

        expect(count).toBe(input[0]);
    });

    it('Validation Input looks correct', () => {
        service.blockTime = 600;
        const input = service.validationInput;

        expect(input[0]).toBe(3);
        expect(input[1]).toBe(11);
    });

    it('Validation works fine (Positive)', () => {
        service.blockTime = 600;
        const input = service.validationInput;
        let id = createBlockId();
        id = '000a' + id.substring(4);

        expect(service.validate(id, input[0], input[1])).toBeTrue();
    });

    it('Validation works fine (Negative)', () => {
        service.blockTime = 600;
        const input = service.validationInput;
        let id = createBlockId();
        id = '000f' + id.substring(4);

        expect(service.validate(id, input[0], input[1])).toBeFalse();
    });
})