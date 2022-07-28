import { BLOCK_ID_LENGTH, createBlockId } from "./block"

describe('block helpers', () => {
    it('block id should have correct length', () => {
        const id = createBlockId();
        expect(id.length).toBe(BLOCK_ID_LENGTH);
    });

    it('block id should have hexa decimal chars only', () => {
        for (let c of createBlockId()) {
            let num = Number.parseInt(c, 16);
            expect(num).toBeGreaterThanOrEqual(0);
            expect(num).toBeLessThanOrEqual(15);
        }
    })
})