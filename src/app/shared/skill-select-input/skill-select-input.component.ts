import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Skill } from '../../skills/skill';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SkillsService } from '../../skills/skills.service';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-skill-select-input',
  templateUrl: './skill-select-input.component.html',
  styleUrls: ['./skill-select-input.component.scss']
})
export class SkillSelectInputComponent implements OnInit {

  @Input() parentForm: FormGroup;

  @ViewChild('skillsAutoComplete') skillsMatAutocomplete: MatAutocomplete;
  @ViewChild('skillInput') skillAutocompleteInput: ElementRef<HTMLInputElement>;

  errorMessage: string = null;
  skills$: Observable<Skill[]> = of([]);
  allAvailableSkills: Skill[];

  elemSeparatorKeysCodes = [COMMA, ENTER];
  skillAutocompleteCtrl = new FormControl();

  constructor(private skillService: SkillsService) {
    this.skills$ = this.skillAutocompleteCtrl.valueChanges.pipe(
      startWith(null),
      map((term: string | null) => term ? this._filter(term) : this.allAvailableSkills));
  }

  ngOnInit() {
    if (!this.parentForm.get('skills')) {
      throw new Error('Parent form must contain skill FormControl');
    }
    this.loadSkills();
  }

  removeSkill(index: number): void {
    if (index >= 0) {
      this.skillsArray.splice(index, 1);
      this.parentForm.markAsDirty();
    }
  }

  selectSkill(event: MatAutocompleteSelectedEvent): void {
    const selectedSkill = event.option.value;
    if (!this.isSkillExist(selectedSkill.name)) {
      this.skillsArray.push(selectedSkill.name);
      this.parentForm.markAsDirty();
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
        this.parentForm.markAsDirty();
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.skillAutocompleteCtrl.setValue(null);
    }
  }

  private loadSkills() {
    this.skillService.getAllSkills().subscribe(skills => {
      this.allAvailableSkills = skills;
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

  private isSkillExist(skillName: string): boolean {
    const skillNameLowerCase = (skillName || '').trim().toLowerCase();
    return this.skillsArray.find(item => item.toLowerCase() === skillNameLowerCase) != null;
  }

  get skillsArray(): string[] {
    return this.parentForm.get('skills').value;
  }
}
