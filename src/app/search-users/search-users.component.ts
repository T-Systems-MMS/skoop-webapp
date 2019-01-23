import { Component, OnInit } from '@angular/core';
import { SkillsService } from '../skills/skills.service';
import { Skill } from '../skills/skill';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.scss']
})
export class SearchUsersComponent implements OnInit {

  skills$: Observable<Skill[]>;

  public form: FormGroup;

  constructor(private skillsService: SkillsService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.skills$ = this.skillsService.getAllSkills();
    this.buildForm();
  }

  createCriteria() : FormGroup {
    return new FormGroup({
      skill: new FormControl(),
      level: new FormControl()
    });
  }

  // add a contact form group
  addCriteria() {
    this.criteriaList.push(this.createCriteria());
  }

  // remove contact from group
  removeCriteria(index) {
    // this.contactList = this.form.get('contacts') as FormArray;
    this.criteriaList.removeAt(index);
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
