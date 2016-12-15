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

describe('MaybeDecorator.un', () => {

    it('should unwrap Just values', () => {
      const result = M(Just('value')).un();
      expect(result).toEqual(Just('value'));
    });

    it('should unwrap Nothing values', () => {
      const result = M(Nothing()).un();
      expect(result).toEqual(Nothing());
    });
});

describe('MaybeDecorator.map', () => {

    it('should convert Just values', () => {
      const result = M(Just("value")).map(str => true).un();
      expect(result).toEqual(Just(true));
    });

    it('should not convert Nothing values', () => {
      const result = M(Nothing()).map(str => false).un();
      expect(result).toEqual(Nothing());
    });

    it('should pass the correct value to the supplied function', () => {
      const result = M(Just('test')).map(str => {
        expect(str).toBe('test');
        return true;
      }).un();
      expect(result).toEqual(Just(true));
    });
});

describe('MaybeDecorator.flatMap', () => {

  it('should return Just when given a Just and f evaluates to Just', () => {
    const result = M(Just('test')).flatMap(str => Just(true)).un();
    expect(result).toEqual(Just(true));
  });

  it('should return Just when given a Nothing', () => {
    const result = M(Nothing()).flatMap(str => Just(true)).un();
    expect(result).toEqual(Nothing());
  });

  it('should return Nothing when given a Just and f evaluates to Nothing', () => {
    const result = M(Just('value')).flatMap(str => Nothing()).un();
    expect(result).toEqual(Nothing());
  });

  it('should provide the correct value to f', () => {
    const result = M(Just('test_value_please_ignore')).flatMap(str => {
      expect(str).toEqual('test_value_please_ignore');
      return Just('correct')
    }).un();
    expect(result).toEqual(Just('correct'));
  });

});

describe('MaybeDecorator.filter', () => {

  it('should return Nothing for false predicate evaluation', () => {
    const result = M(Maybe("val")).filter(str => false).un();
    expect(result).toEqual(Nothing());
  });

  it('should return Just for true predicate evaluation', () => {
    const result = M(Maybe("val")).filter(str => true).un();
    expect(result).toEqual(Just("val"));
  });

  it('should provide the correct value to the predicate', () => {
    const result = M(Maybe("val")).filter(str => {
      expect(str).toEqual("val");
      return true;
    }).un();
    expect(result).toEqual(Just("val"));
  });
});
