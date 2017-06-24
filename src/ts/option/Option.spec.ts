import { Option, Some, None, M, sequenceM, Monad, all } from './Option';
import 'jest';
import 'jasmine';

describe('Option', () => {

  it('return None when passed null', () => {
    expect(Option(null)).toEqual(None());
  });

  it('return None when passed undefined', () => {
    var testObj: any = {};
    expect(Option(testObj.undefined)).toEqual(None());
  });

  it('return Just when passed a nonnull value', () => {
    expect(Option('woo')).toEqual(Some('woo'));
  });

  it('return Just when passed zero', () => {
    expect(Option(0)).toEqual(Some(0));
  });

});

describe('OptionDecorator.caseOf', () => {

  it('should invoke "some" when given a Some', () => {
    const result = M(Some('value')).caseOf({
      some: v => true,
      none: () => false
    });
    expect(result).toBe(true);
  });

  it('should invoke "none" when given a None', () => {
    const result = M(None()).caseOf({
      some: v => true,
      none: () => false
    });
    expect(result).toBe(false);
  });

  it('should not invoke "none" when given a Some', () => {
    const result = M(Option('value')).caseOf({
      some: v => true,
      none: () => { throw new Error("should not be called") }
    });
    expect(result).toBe(true);
  });

  it('should not invoke "some" when given a None', () => {
    const result = M(None()).caseOf({
      some: v => { throw new Error("should not be called") },
      none: () => false
    });
    expect(result).toBe(false);
  });

});

describe('OptionDecorator.un', () => {

    it('should unwrap Some values', () => {
      const result = M(Some('value')).un();
      expect(result).toEqual(Some('value'));
    });

    it('should unwrap None values', () => {
      const result = M(None()).un();
      expect(result).toEqual(None());
    });
});

describe('OptionDecorator.map', () => {

    it('should convert Some values', () => {
      const result = M(Some('value')).map(str => true).un();
      expect(result).toEqual(Some(true));
    });

    it('should not convert None values', () => {
      const result = M(None()).map(str => false).un();
      expect(result).toEqual(None());
    });

    it('should pass the correct value to the supplied function', () => {
      const result = M(Some('test')).map(str => {
        expect(str).toBe('test');
        return true;
      }).un();
      expect(result).toEqual(Some(true));
    });
});

describe('OptionDecorator.flatMap', () => {

  it('should return Some when given a Some and f evaluates to Some', () => {
    const result = M(Some('test')).flatMap(str => Some(true)).un();
    expect(result).toEqual(Some(true));
  });

  it('should return None when given a None', () => {
    const result = M(None()).flatMap(str => Some(true)).un();
    expect(result).toEqual(None());
  });

  it('should return None when given a Some and f evaluates to None', () => {
    const result = M(Some('value')).flatMap(str => None()).un();
    expect(result).toEqual(None());
  });

  it('should provide the correct value to f', () => {
    const result = M(Some('test_value_please_ignore')).flatMap(str => {
      expect(str).toEqual('test_value_please_ignore');
      return Some('correct')
    }).un();
    expect(result).toEqual(Some('correct'));
  });

});

describe('OptionDecorator.filter', () => {

  it('should return None for false predicate evaluation', () => {
    const result = M(Option('val')).filter(str => false).un();
    expect(result).toEqual(None());
  });

  it('should return Some for true predicate evaluation', () => {
    const result = M(Option('val')).filter(str => true).un();
    expect(result).toEqual(Some('val'));
  });

  it('should provide the correct value to the predicate', () => {
    const result = M(Option('val')).filter(str => {
      expect(str).toEqual('val');
      return true;
    }).un();
    expect(result).toEqual(Some('val'));
  });
});

describe('OptionDecorator.getOrElse', () => {

  it('should return the original value if given a Some', () => {
    const result = M(Option('val')).getOrElse(() => 'unused');
    expect(result).toEqual('val');
  });

  it('should return the supplied value if given a None', () => {
    const result = M(None()).getOrElse(() => 'should-be-used');
    expect(result).toEqual('should-be-used');
  });

  it('should not invoke f if given a Just', () => {
    const result = M(Option('val')).getOrElse(() => {
      throw new Error("This shouldn't have been invoked.");
    });
    expect(result).toEqual('val');
  });

});

describe('OptionDecorator.orElse', () => {

  it('should return the original value if given a Just', () => {
    const result = M(Option('val')).orElse('unused');
    expect(result).toEqual('val');
  });

  it('should return the supplied value if given a Nothing', () => {
    const result = M(None()).orElse('should-be-used');
    expect(result).toEqual('should-be-used');
  });

});

describe('OptionDecorator.isJust', () => {

  it('should return true if given a Just', () => {
    const result = M(Option('val')).isDefined();
    expect(result).toEqual(true);
  });

  it('should return false if given a Nothing', () => {
    const result = M(None()).isDefined();
    expect(result).toEqual(false);
  });

});

describe('all', () => {

  it('should reduce justs into', () => {
    const ops = all([Some(5), Some(9), Some("10")])

    expect(ops).toEqual(Some([5, 9, "10"]));
  });

  it('should return a Just with a list', () => {
    const ops = all([Some(5), Some(9), Some("sasdf")]);

    const result = M(ops).map(([a, b, c]) => a + b).un();

    expect(result).toEqual(Some(14));
  });

  it('should reduce justs into', () => {
    const ops = all([Some(5), Some(9), None()]);

    const result = M(ops).map(([a, b, c]) => a + b).un();

    expect(result).toEqual(None());
  });

});
