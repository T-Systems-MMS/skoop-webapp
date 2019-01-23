import { Component, OnInit } from '@angular/core';
import { SkillsService } from '../skills/skills.service';
import { Skill } from '../skills/skill';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SearchUsersService } from './search-users.service';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.scss']
})
export class SearchUsersComponent implements OnInit {

  skills$: Observable<Skill[]>;

  public form: FormGroup;

  constructor(private skillsService: SkillsService,
              private searchService: SearchUsersService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.skills$ = this.skillsService.getAllSkills();
    this.buildForm();
  }

  createCriteria(): FormGroup {
    return this.fb.group({
      skill: ['', Validators.required],
      level: 0 // default skill level
    });
  }

  addCriteria() {
    this.criteriaList.push(this.createCriteria());
  }

  removeCriteria(index) {
    this.criteriaList.removeAt(index);
  }

  search() {
    const criteriaList: string[] = this.criteriaList.value.map(item => {
      return `${item.skill}+${item.level}`;
    });

    this.searchService.search(criteriaList)
      .subscribe(data => {
        console.log(data);
      }, err => {

      });
  }

  private buildForm() {
    this.form = this.fb.group({
      criteriaList: this.fb.array([this.createCriteria()])
    });
  }

  get criteriaList() {
    return this.form.get('criteriaList') as FormArray;
  }
}
