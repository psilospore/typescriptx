import { Maybe, Just, Nothing, M } from './Maybe';
import 'jest';
import 'jasmine';

describe('Maybe', () => {

  it('return Nothing when passed null', () => {
    expect(Maybe(null)).toEqual({
      type: 'Nothing'
    });
  });

  it('return Nothing when passed undefined', () => {
    var testObj: any = {};
    expect(Maybe(testObj.undefined)).toEqual({
      type: 'Nothing'
    });
  });

  it('return Just when passed a nonnull value', () => {
    expect(Maybe("woo")).toEqual({
      type: 'Just',
      value: "woo"
    });
  });

  it('return Just when passed zero', () => {
    expect(Maybe(0)).toEqual({
      type: 'Just',
      value: 0
    });
  });

});

describe('MaybeDecorator.caseOf', () => {

  it('should invoke "just" when given a Just', () => {
    const result = M(Just("value")).caseOf({
      just: v => true,
      nothing: () => false
    });
    expect(result).toBe(true);
  });

  it('should invoke "nothing" when given a Nothing', () => {
    const result = M(Nothing()).caseOf({
      just: v => true,
      nothing: () => false
    });
    expect(result).toBe(false);
  });

  it('should not invoke "nothing" when given a Just', () => {
    const result = M(Maybe("value")).caseOf({
      just: v => true,
      nothing: () => { throw new Error("should not be called") }
    });
    expect(result).toBe(true);
  });

  it('should not invoke "just" when given a Nothing', () => {
    const result = M(Nothing()).caseOf({
      just: v => { throw new Error("should not be called") },
      nothing: () => false
    });
    expect(result).toBe(false);
  });

});

describe('Maybe.caseOf', () => {

  const myThing = M(Maybe('lol')).map(str => true).un();

});
