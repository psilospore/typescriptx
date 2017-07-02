import 'jest';
import 'jasmine';
import {compose, identity} from './function';

describe('compose', () => {
    it('should compose functions', () => {
        const getLength = (s: string) => s.length;
        const squared = (n : number) => ({
            sq: n * n,
            ln: n
        });

        const doIt = compose(getLength, squared);

        expect(doIt("asdf")).toEqual({
            sq: 16,
            ln: 4
        })
    });
});

describe('compose', () => {
    it("shouldn't modify values", () => {
        expect(identity(5)).toEqual(5);
    })
});