import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatBottomSheetRef, MatChipInputEvent } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Skill } from '../skills/skill';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TestimonialService } from './testimonial.service';
import { HttpErrorResponse } from '@angular/common/http';
import { map, startWith } from 'rxjs/operators';
import { Testimonial } from './testimonial';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { SkillsService } from '../skills/skills.service';

@Component({
  selector: 'app-testimonials-new',
  templateUrl: './testimonials-new.component.html',
  styleUrls: ['./testimonials-new.component.scss']
})
export class TestimonialsNewComponent implements OnInit {

  @ViewChild('skillsAutoComplete') skillsMatAutocomplete: MatAutocomplete;
  @ViewChild('skillInput') skillAutocompleteInput: ElementRef<HTMLInputElement>;

  testimonialForm: FormGroup;
  errorMessage: string = null;
  skills$: Observable<Skill[]> = of([]);
  allAvailableSkills: Skill[];

  elemSelectable = true;
  elemRemovable = true;
  elemAddOnBlur = false;
  elemSeparatorKeysCodes = [COMMA, ENTER];
  skillAutocompleteCtrl = new FormControl();

  constructor(private testimonialService: TestimonialService,
              private skillService: SkillsService,
              private formBuilder: FormBuilder,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              private bottomSheet: MatBottomSheetRef) {
    this.skills$ = this.skillAutocompleteCtrl.valueChanges.pipe(
      startWith(null),
      map((term: string | null) => term ? this._filter(term) : this.allAvailableSkills));
  }

  ngOnInit() {
    this.loadSkills();
    this.testimonialForm = this.formBuilder.group({
      author: new FormControl('', Validators.required),
      skills: new FormControl([]),
      comment: new FormControl('', Validators.required)
    });
  }

  addTestimonial() {
    this.testimonialService.createTestimonial(this.getTestimonialData())
      .subscribe((data) => {
        this.testimonialForm.reset();
        this.bottomSheet.dismiss(data);
      }, (errorResponse: HttpErrorResponse) => {
        this.handleErrorResponse(errorResponse);
      });
  }

  close() {
    this.bottomSheet.dismiss();
  }

  removeSkill(index: number): void {
    if (index >= 0) {
      this.skillsArray.splice(index, 1);
    }
  }

  selectSkill(event: MatAutocompleteSelectedEvent): void {
    const selectedSkill = event.option.value;
    if (!this.isSkillExist(selectedSkill.name)) {
      this.skillsArray.push(selectedSkill.name);
    }

    this.skillAutocompleteInput.nativeElement.value = '';
    this.skillAutocompleteCtrl.setValue(null);
  }

  addNewSkill(event: MatChipInputEvent) {
    // Add skill only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.skillsMatAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      if (!this.isSkillExist(value)) {
        this.skillsArray.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.skillAutocompleteCtrl.setValue(null);
    }
  }

  private getTestimonialData(): Testimonial {
    return {
      author: this.testimonialForm.get('author').value,
      skills: this.skillsArray || [],
      comment: this.testimonialForm.get('comment').value
    } as Testimonial;
  }

  private loadSkills() {
    this.skillService.getAllSkills().subscribe(skills => {
      this.allAvailableSkills = skills;
    }, (errorResponse: HttpErrorResponse) => {
      this.handleErrorResponse(errorResponse);
    });
  }

  private _filter(value: any): Skill[] {
    // the FormControl valueChanges event isn't reliably returning a String
    if (typeof value === 'object') {
      return this.allAvailableSkills;
    }

    const filterValue = value.toLowerCase();
    return this.allAvailableSkills.filter(skill => skill.name.toLowerCase().indexOf(filterValue) != -1);
  }

  private isSkillExist(skillName: string) {
    const skillNameLowerCase = (skillName || '').trim().toLowerCase();
    return this.skillsArray.find(item => item.toLowerCase() === skillNameLowerCase) != null;
  }

  private handleErrorResponse(errorResponse: HttpErrorResponse) {
    this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    // Dirty fix because of: https://github.com/angular/angular/issues/17772
    this.changeDetector.markForCheck();
  }

  get skillsArray(): string[] {
    return this.testimonialForm.get('skills').value;
  }
}
