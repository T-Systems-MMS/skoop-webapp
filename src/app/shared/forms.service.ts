import {Injectable} from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Generic functionality
 */
@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor() {
  }

  /**
   * Creates a form validator function from a predicate function.
   * @param validationKey Property to set in the error object if validation fails. The value is set to the validated
   *                      control value.
   * @param validationMethod Predicate function to wrap into a validator function.
   * @returns Validator function for the given predicate function.
   */
  public validatorFnOf<T>(validationKey: string, validationMethod: (value: T) => boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === undefined || control.value === null || !validationMethod(control.value)) {
        const result = {};
        result[validationKey] = control.value;
        return result;
      } else {
        return null;
      }
    };
  }
}
