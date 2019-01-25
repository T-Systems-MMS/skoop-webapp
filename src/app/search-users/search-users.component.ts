import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SkillsService } from '../skills/skills.service';
import { Skill } from '../skills/skill';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { SearchUsersService } from './search-users.service';
import { AnonymousUserSkill } from './anonymous-user-skill';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { DownloadService } from './download.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.scss']
})
export class SearchUsersComponent implements OnInit {

  skills$: Observable<Skill[]> = of([]);
  userSkills: AnonymousUserSkill[] = [];
  showSearchResult = false;
  errorMessage: string = null;

  @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;

  public form: FormGroup;

  constructor(private skillsService: SkillsService,
              private searchService: SearchUsersService,
              private fb: FormBuilder,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              private downloadService: DownloadService) {
  }

  ngOnInit() {
    this.skills$ = this.skillsService.getAllSkills();
    this.buildForm();
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

  search() {
    const criteriaList: string[] = this.criteriaList.value.map(item => `${item.skill}+${item.level}`);

    this.searchService.search(criteriaList)
      .subscribe(userSkills => {
        this.userSkills = userSkills;
        this.showSearchResult = true;
      }, err => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(err);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  private buildForm() {
    this.form = this.fb.group({
      criteriaList: this.fb.array([this.createCriteria()])
    });

    // hide results on change
    this.form.valueChanges.subscribe(() => {
      this.showSearchResult = false;
    });
  }

  downloadAnonymousUserProfile(userReference: string): void {
    this.downloadService.downloadAnonymousUserProfile(userReference).subscribe((data: Blob) => {

      const url: string = URL.createObjectURL(data);
      const link = this.downloadZipLink.nativeElement;

      link.href = url;
      link.download = 'user-profile.docx';
      link.click();

      URL.revokeObjectURL(url);
    }, (errorResponse: HttpErrorResponse) => {
      this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
    });
  }

  get criteriaList() {
    return this.form.get('criteriaList') as FormArray;
  }
}
