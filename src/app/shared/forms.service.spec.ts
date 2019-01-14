import {TestBed, inject} from '@angular/core/testing';

import {FormsService} from './forms.service';
import {FormControl} from '@angular/forms';
import createSpy = jasmine.createSpy;

describe('FormsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormsService]
    });
  });

  it('can be created', inject([FormsService], (service: FormsService) => {
    expect(service).toBeTruthy();
  }));

  it('creates a function which returns null on validation success',
    inject([FormsService], (service: FormsService) => {
      const validatorFn = service.validatorFnOf('testKey', () => true);
      const validationErrors = validatorFn(new FormControl('test'));
      expect(validationErrors).toBeNull();
    }));

  it('creates a function which returns an error object on validation failure',
    inject([FormsService], (service: FormsService) => {
      const validatorFn = service.validatorFnOf('testKey', () => false);
      const validationErrors = validatorFn(new FormControl('test'));
      expect(validationErrors).not.toBeNull();
      expect(validationErrors.testKey).toBe('test');
    }));

  it('creates a function which returns an error object if control value is null',
    inject([FormsService], (service: FormsService) => {
      const validatorFn = service.validatorFnOf('testKey', () => true);
      const validationErrors = validatorFn(new FormControl(null));
      expect(validationErrors).not.toBeNull();
      expect(validationErrors.testKey).toBe(null);
    }));

  it('creates a function which calls the predicate function for validation',
    inject([FormsService], (service: FormsService) => {
      const spy = createSpy().and.returnValue(true);
      const validatorFn = service.validatorFnOf('testKey', spy);
      validatorFn(new FormControl('test'));
      expect(spy).toHaveBeenCalledWith('test');
    }));
});
