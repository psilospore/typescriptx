import { Either, Left, Right, all } from './Either';
import 'jest';
import 'jasmine';

// describe('EitherDecorator.caseOf', () => {

//   it('should invoke "left" when given a Left', () => {
//     const e: Either<string, number> = Left("value");
//     const result = E(e).caseOf({
//       left: left => left + "_success",
//       right: right => "lol"
//     });

//     expect(result).toBe("value_success");
//   });

//   it('should invoke "right" when given a Right', () => {
//     const e: Either<string, number> = Right(5);
//     const result = E(e).caseOf({
//       left: left => 0,
//       right: right => right + 10
//     });

//     expect(result).toBe(15);
//   });
// });

// describe('EitherDecorator.isRight', () => {

//   it('should return true when given a Right', () => {
//     const e: Either<string, number> = Right(5);
//     const result = E(e).isRight();

//     expect(result).toBe(true);
//   });

//   it('should return false when given a Left', () => {
//     const e: Either<string, number> = Left("value");
//     const result = E(e).isRight();

//     expect(result).toBe(false);
//   });
// });

// describe('EitherDecorator.isLeft', () => {

//   it('should return false when given a Right', () => {
//     const e: Either<string, number> = Right(5);
//     const result = E(e).isLeft();

//     expect(result).toBe(false);
//   });

//   it('should return true when given a Left', () => {
//     const e: Either<string, number> = Left("value");
//     const result = E(e).isLeft();

//     expect(result).toBe(true);
//   });
// });

// describe('EitherDecorator.map', () => {

//   it('should convert Right values', () => {
//     const result = E(Right("value")).map(str => true).un();
//     expect(result).toEqual(Right(true));
//   });

//   it('should not convert Nothing values', () => {
//     const result = E(Left(508)).map(str => false).un();
//     expect(result).toEqual(Left(508));
//   });

//   it('should pass the correct value to the supplied function', () => {
//     const result = E(Right('test')).map(str => {
//       expect(str).toBe('test');
//       return true;
//     }).un();
//     expect(result).toEqual(Right(true));
//   });
// });

// describe('EitherDecorator.flatMap', () => {

//   it('should return Right when given a Just and f evaluates to Right', () => {
//     const result = E(Right('test')).flatMap(str => Right(true)).un();
//     expect(result).toEqual(Right(true));
//   });

//   it('should return Left when given a Left', () => {
//     const result = E(Left(508)).flatMap(str => Right(true)).un();
//     expect(result).toEqual(Left(508));
//   });

//   it('should return Left when given a Right and f evaluates to Left', () => {
//     const value = <Either<number, string>> Right('value');

//     const result = E(value).flatMap(str => Left(508)).un();
//     expect(result).toEqual(Left(508));
//   });

//   it('should provide the correct value to f', () => {
//     const result = E(Right('test_value_please_ignore')).flatMap(str => {
//       expect(str).toEqual('test_value_please_ignore');
//       return Right('correct')
//     }).un();
//     expect(result).toEqual(Right('correct'));
//   });

  describe('all', () => {
    it('should bind through all rights', () => {

      const test = all([Right("yes"), Right(5), Right({userName: 'johndoe', coolPercentage: 100})]);


      const result = test.flatMap(([myStr, myNum, user]) => {
        return Right(myStr.repeat(myNum));
      });

      if(result.type === "Right") {
        expect(result.right).toEqual("yesyesyesyesyes");
      }

    });
  });

  // describe('swap', () => {
  //   it('should swap types', () => {
      
  //     expect(E(Right("test_value")).swap().un()).toEqual(Left("test_value"))


  //     expect(E(Left(5)).swap().un()).toEqual(Right(5))

  //   });
  // });

// });
