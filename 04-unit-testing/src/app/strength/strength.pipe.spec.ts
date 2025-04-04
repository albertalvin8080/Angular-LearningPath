import { StrengthPipe } from "./strength.pipe";

describe("StrengthPipe", () => {
    let pipe: StrengthPipe;

    beforeAll(() => {
        pipe = new StrengthPipe();
    });

    it('should return weak if value is less or equal to 5', () => {
        const result = pipe.transform(5);
        expect(result).toEqual('5 (weak)');
    });

    it('should return strong if value is less or greater than 10', () => {
        const r = pipe.transform(10);
        expect(r).toEqual('10 (strong)');
    })
});