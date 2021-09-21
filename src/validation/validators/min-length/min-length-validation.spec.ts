import { InvalidFieldError } from '../../errors';
import { MinLengthValidation } from './min-length-validation';

describe('MinLengthValidation', () => {
  test('should return error if value is invalid', () => {
    const sut = new MinLengthValidation('field', 5);

    const error = sut.validate('123');

    expect(error).toEqual(new InvalidFieldError('field'));
  });

  test('should return falsy if value is valid', () => {
    const sut = new MinLengthValidation('field', 5);

    const error = sut.validate('12345');

    expect(error).toBeFalsy();
  });
});