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


describe('Maybe.caseOf', () => {

  const myMaybe = Maybe('adsf');

  const myThing = M(myMaybe).map(str => true);

  const unwrapped = myThing.un();

});

describe('Maybe.caseOf', () => {

  const myThing = M(Maybe('lol')).map(str => true).un();

});
