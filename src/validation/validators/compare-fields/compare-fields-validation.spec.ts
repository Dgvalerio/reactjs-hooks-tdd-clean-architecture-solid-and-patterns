// eslint-disable-next-line import/no-extraneous-dependencies
import faker from 'faker';

import { InvalidFieldError } from '../../errors';
import { CompareFieldsValidation } from './compare-fields-validation';

const makeSut = (fieldName: string, valueToCompare: string) =>
  new CompareFieldsValidation(fieldName, valueToCompare);

describe('CompareFieldsValidation', () => {
  test('should return error if compare is invalid', () => {
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName, faker.random.word());

    const error = sut.validate(faker.random.word());

    expect(error).toEqual(new InvalidFieldError(fieldName));
  });

  test('should return falsy if compare is valid', () => {
    const fieldName = faker.database.column();
    const valueToCompare = faker.random.word();
    const sut = makeSut(fieldName, valueToCompare);

    const error = sut.validate(valueToCompare);

    expect(error).toBeFalsy();
  });
});