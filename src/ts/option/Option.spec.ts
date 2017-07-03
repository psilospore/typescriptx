import { Option, Some, None, all } from './Option';
import 'jest';
import 'jasmine';

describe('Option', () => {
  
  it('should work', () => {
    all([Some("test"), Some(5), Some({user: 'Paul', password:'supersecret'})])
      .flatMap(([myStr, myNum, myUser]) => {
        console.log(myStr, myNum, myUser);
        return None();
      });
  });

//   it('return None when passed null', () => {
//     expect(Option(null)).toEqual(None());
//   });

//   it('return None when passed undefined', () => {
//     var testObj: any = {};
//     expect(Option(testObj.undefined)).toEqual(None());
//   });

//   it('return Some when passed a nonnull value', () => {
//     expect(Option('woo')).toEqual(Some('woo'));
//   });

//   it('return Some when passed zero', () => {
//     expect(Option(0)).toEqual(Some(0));
//   });

});

// describe('OptionDecorator.caseOf', () => {

//   it('should invoke "some" when given a Some', () => {
//     const result = O(Some('value')).caseOf({
//       some: v => true,
//       none: () => false
//     });
//     expect(result).toBe(true);
//   });

//   it('should invoke "none" when given a None', () => {
//     const result = O(None()).caseOf({
//       some: v => true,
//       none: () => false
//     });
//     expect(result).toBe(false);
//   });

//   it('should not invoke "none" when given a Some', () => {
//     const result = O(Option('value')).caseOf({
//       some: v => true,
//       none: () => { throw new Error("should not be called") }
//     });
//     expect(result).toBe(true);
//   });

//   it('should not invoke "some" when given a None', () => {
//     const result = O(None()).caseOf({
//       some: v => { throw new Error("should not be called") },
//       none: () => false
//     });
//     expect(result).toBe(false);
//   });

// });

// describe('OptionDecorator.un', () => {

//     it('should unwrap Some values', () => {
//       const result = O(Some('value')).un();
//       expect(result).toEqual(Some('value'));
//     });

//     it('should unwrap None values', () => {
//       const result = O(None()).un();
//       expect(result).toEqual(None());
//     });
// });

// describe('OptionDecorator.map', () => {

//     it('should convert Some values', () => {
//       const result = O(Some('value')).map(str => true).un();
//       expect(result).toEqual(Some(true));
//     });

//     it('should not convert None values', () => {
//       const result = O(None()).map(str => false).un();
//       expect(result).toEqual(None());
//     });

//     it('should pass the correct value to the supplied function', () => {
//       const result = O(Some('test')).map(str => {
//         expect(str).toBe('test');
//         return true;
//       }).un();
//       expect(result).toEqual(Some(true));
//     });
// });

// describe('OptionDecorator.flatMap', () => {

//   it('should return Some when given a Some and f evaluates to Some', () => {
//     const result = O(Some('test')).flatMap(str => Some(true)).un();
//     expect(result).toEqual(Some(true));
//   });

//   it('should return None when given a None', () => {
//     const result = O(None()).flatMap(str => Some(true)).un();
//     expect(result).toEqual(None());
//   });

//   it('should return None when given a Some and f evaluates to None', () => {
//     const result = O(Some('value')).flatMap(str => None()).un();
//     expect(result).toEqual(None());
//   });

//   it('should provide the correct value to f', () => {
//     const result = O(Some('test_value_please_ignore')).flatMap(str => {
//       expect(str).toEqual('test_value_please_ignore');
//       return Some('correct')
//     }).un();
//     expect(result).toEqual(Some('correct'));
//   });

// });

// describe('OptionDecorator.filter', () => {

//   it('should return None for false predicate evaluation', () => {
//     const result = O(Option('val')).filter(str => false).un();
//     expect(result).toEqual(None());
//   });

//   it('should return Some for true predicate evaluation', () => {
//     const result = O(Option('val')).filter(str => true).un();
//     expect(result).toEqual(Some('val'));
//   });

//   it('should provide the correct value to the predicate', () => {
//     const result = O(Option('val')).filter(str => {
//       expect(str).toEqual('val');
//       return true;
//     }).un();
//     expect(result).toEqual(Some('val'));
//   });
// });

// describe('OptionDecorator.getOrElse', () => {

//   it('should return the original value if given a Some', () => {
//     const result = O(Option('val')).getOrElse(() => 'unused');
//     expect(result).toEqual('val');
//   });

//   it('should return the supplied value if given a None', () => {
//     const result = O(None()).getOrElse(() => 'should-be-used');
//     expect(result).toEqual('should-be-used');
//   });

//   it('should not invoke f if given a Just', () => {
//     const result = O(Option('val')).getOrElse(() => {
//       throw new Error("This shouldn't have been invoked.");
//     });
//     expect(result).toEqual('val');
//   });

// });

// describe('OptionDecorator.orElse', () => {

//   it('should return the original value if given a Just', () => {
//     const result = O(Option('val')).orElse('unused');
//     expect(result).toEqual('val');
//   });

//   it('should return the supplied value if given a Nothing', () => {
//     const result = O(None()).orElse('should-be-used');
//     expect(result).toEqual('should-be-used');
//   });

// });

// describe('OptionDecorator.isJust', () => {

//   it('should return true if given a Just', () => {
//     const result = O(Option('val')).isDefined();
//     expect(result).toEqual(true);
//   });

//   it('should return false if given a Nothing', () => {
//     const result = O(None()).isDefined();
//     expect(result).toEqual(false);
//   });

// });

describe('all', () => {

  it('should reduce justs into', () => {
    const ops = all([Some(5), Some(9), Some("10")])

    expect(ops).toEqual(Some([5, 9, "10"]));
  });

  it('should return a Just with a list', () => {
    const ops = all([Some(5), Some(9), Some("sasdf")]);

    const result = ops.map(([a, b, c]) => a + b);

    expect(result).toEqual(Some(14));
  });

  it('should reduce justs into', () => {
    const ops = all([Some(5), Some(9), None()]);

    const result = ops.map(([a, b, c]) => a + b);

    expect(result).toEqual(None());
  });

});
