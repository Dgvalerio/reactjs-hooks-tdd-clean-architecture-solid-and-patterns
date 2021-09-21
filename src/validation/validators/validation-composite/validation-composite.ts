import { Validation } from '../../../presentation/protocols/validation';
import { FieldValidation } from '../../protocols/field-validation';

export class ValidationComposite implements Validation {
  // eslint-disable-next-line no-empty-function
  private constructor(private readonly validators: FieldValidation[]) {}

  static build(validators: FieldValidation[]) {
    return new ValidationComposite(validators);
  }

  validate(fieldName: string, fieldValue: string): string {
    const validators = this.validators.filter((v) => v.field === fieldName);

    // eslint-disable-next-line no-restricted-syntax
    for (const validator of validators) {
      const error = validator.validate(fieldValue);

      if (error) return error.message;
    }

    return null;
  }
}
