import { Try, Success, Err, T, TryDecorator } from './Try';
import 'jest';
import 'jasmine';

describe('Try', () => {

  it('should return Success if value is successfully computed', () => {
    const result = Try(() => {
      return "successful";
    });
    expect(result).toEqual(Success("successful"));
  });

  it('should return Err if f throws', () => {
    const result = Try(() => {
      throw new Error("should be caught");
    });
    expect(result).toEqual(Err(new Error("should be caught")));
  });
});

const successful = T(Try(() => {
  return "successful";
}));

const failure = T(Try(() => {
  throw new Error("error");
}));

describe('Try.caseOf', () => {

  it('should invoke success if given a Success', () => {
    const result = successful.caseOf({
      success: s => 508,
      err: e => 0
    })
    expect(result).toEqual(508);
  });

  it('should invoke err if given an Err', () => {
    const result = failure.caseOf({
      success: s => 508,
      err: e => 0
    });
    expect(result).toEqual(0);
  });
});

describe('Try.map', () => {

  it('should return the value of f if given a Success', () => {
    const result = successful.map(str => true).un();
    expect(result).toEqual(Success(true));
  });

  it('should return an Err if given an Err', () => {
    const result = failure.map(str => true).un();
    expect(result).toEqual(Err(new Error("error")));
  });

});

describe('Try.flatMap', () => {

  it('should return Success when given a Success and f evaluates to Success', () => {
    const result = successful.flatMap(str => Success(true)).un();
    expect(result).toEqual(Success(true));
  });

  it('should return Err when given a Err', () => {
    const result = failure.flatMap(str => Success(true)).un();
    expect(result).toEqual(Err(new Error("error")));
  });

  it('should return Err when given a Success and f evaluates to Err', () => {
    const result = successful.flatMap(str => Err(508)).un();
    expect(result).toEqual(Err(508));
  });

});
