import { Maybe, Just, Nothing, M } from './Maybe';
import 'jest';

describe('Maybe.of', () => {

  it('return Nothing when passed null', () => {
    expect(Maybe.of(null)).toEqual({
      type: 'Nothing'
    });
  });

  it('return Nothing when passed undefined', () => {
    var testObj: any = {};
    expect(Maybe.of(testObj.undefined)).toEqual({
      type: 'Nothing'
    });
  });

  it('return Just when passed a nonnull value', () => {
    expect(Maybe.of("woo")).toEqual({
      type: 'Just',
      value: "woo"
    });
  });

  it('return Just when passed zero', () => {
    expect(Maybe.of(0)).toEqual({
      type: 'Just',
      value: 0
    });
  });

});


describe('Maybe.caseOf', () => {

  const myMaybe = Maybe.of('adsf');

  const myThing = M(myMaybe).map(str => true);

  const unwrapped = myThing.unwrap();

  unwrapped

});
