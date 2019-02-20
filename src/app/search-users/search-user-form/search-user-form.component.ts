import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Skill } from '../../skills/skill';
import { SkillsService } from '../../skills/skills.service';
import { AnonymousUserSkill } from '../anonymous-user-skill';
import { SearchUsersService } from './search-users.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-search-user-form',
  templateUrl: './search-user-form.component.html',
  styleUrls: ['./search-user-form.component.scss']
})
export class SearchUserFormComponent implements OnInit {

  public form: FormGroup;
  skills$: Observable<Skill[]> = of([]);

  @Output() criteriaChangedEvent = new EventEmitter<void>();
  @Output() errorOccurredEvent = new EventEmitter<HttpErrorResponse>();
  @Output() usersFoundEvent = new EventEmitter<AnonymousUserSkill[]>();

  constructor(private skillsService: SkillsService,
              private searchService: SearchUsersService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.skills$ = this.skillsService.getAllSkills();
    this.buildForm();
  }

  search() {
    const criteriaList: string[] = this.criteriaList.value.map(item => `${item.skill}+${item.level}`);

    this.searchService.search(criteriaList)
      .subscribe(userSkills => {
        this.usersFoundEvent.emit(userSkills);
      }, err => {
        this.errorOccurredEvent.emit(err);
      });
  }

  isValid(): boolean {
    return this.form && this.form.valid;
  }

  private buildForm() {
    this.form = this.fb.group({
      criteriaList: this.fb.array([this.createCriteria()])
    });

    this.form.valueChanges.subscribe(() => {
      this.criteriaChangedEvent.emit();
    });
  }

  createCriteria(): FormGroup {
    return this.fb.group({
      skill: [null, Validators.required],
      level: 0 // default skill level
    });
  }

  addCriteria() {
    this.criteriaList.push(this.createCriteria());
  }

  removeCriteria(index) {
    this.criteriaList.removeAt(index);
    this.checkDuplicates();
  }

  checkDuplicates() {
    const counts = [];

    this.criteriaList.controls.forEach(item => {
      if (item.value.skill === null || counts[item.value.skill] === undefined) {
        counts[item.value.skill] = 1;
      } else {
        counts[item.value.skill]++;
      }
    });

    this.criteriaList.controls.forEach(item => {
      if (counts[item.value.skill] > 1) {
        item.setErrors({isDuplicated: true});
      } else {
        item.setErrors(null);
      }
    });
  }

  get criteriaList() {
    return this.form.get('criteriaList') as FormArray;
  }
}
