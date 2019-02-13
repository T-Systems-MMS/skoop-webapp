import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatBottomSheetRef,
  MatDialog
} from '@angular/material';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { CommunitiesService } from './communities.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommunityType } from './community-type.enum';
import { ClosedCommunityConfirmDialogComponent } from './closed-community-confirm-dialog.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SkillsService } from '../skills/skills.service';
import { Observable, of } from 'rxjs';
import { Skill } from '../skills/skill';
import { CommunityRequest } from './community-request';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-communities-new',
  templateUrl: './communities-new.component.html',
  styleUrls: ['./communities-new.component.scss']
})
export class CommunitiesNewComponent implements OnInit {

  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('skillInput') skillAutocompleteInput: ElementRef<HTMLInputElement>;

  communityForm: FormGroup;
  errorMessage: string = null;
  skills$: Observable<Skill[]> = of([]);
  allAvailableSkills: Skill[];

  elemSelectable = true;
  elemRemovable = true;
  elemAddOnBlur = false;
  elemSeparatorKeysCodes = [COMMA, ENTER];
  skillAutocompleteCtrl = new FormControl();

  constructor(private communityService: CommunitiesService,
              private skillsService: SkillsService,
              private formBuilder: FormBuilder,
              private bottomSheet: MatBottomSheetRef,
              private changeDetector: ChangeDetectorRef,
              private globalErrorHandlerService: GlobalErrorHandlerService,
              public dialog: MatDialog) {
    this.skills$ = this.skillAutocompleteCtrl.valueChanges.pipe(
      startWith(null),
      map((term: string | null) => term ? this._filter(term) : this.allAvailableSkills));
  }

  ngOnInit() {
    this.loadSkills();
    this.communityForm = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      type: new FormControl(CommunityType.OPENED),
      skills: new FormControl([]),
      description: new FormControl(''),
      links: new FormArray([])
    });
  }

  addLink() {
    this.linkList.push(this.createLinkFormGroup());
  }

  removeLink(index) {
    this.linkList.removeAt(index);
  }

  createCommunity() {
    const communityData = this.getCommunityData();
    if (communityData.type === CommunityType.OPENED) {
      this.innerCreateCommunity(communityData);
    } else {
      const dialogRef = this.dialog.open(ClosedCommunityConfirmDialogComponent, {
        width: '350px',
        data: {}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.innerCreateCommunity(communityData);
        }
      });
    }
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
    if (!this.skillsArray.find(skill => skill.id === selectedSkill.id)) {
      this.skillsArray.push(selectedSkill);
    }

    this.skillAutocompleteInput.nativeElement.value = '';
    this.skillAutocompleteCtrl.setValue(null);
  }

  private createLinkFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: [null, Validators.required],
      href: [null, Validators.required]
    });
  }

  private getCommunityData(): CommunityRequest {
    return {
      title: this.communityForm.get('title').value,
      type: this.communityForm.get('type').value,
      skillIds: (this.skillsArray || []).map(item => item.id),
      description: this.communityForm.get('description').value,
      links: this.communityForm.get('links').value
    } as CommunityRequest;
  }

  private innerCreateCommunity(community: CommunityRequest) {
    this.communityService.createCommunity(community)
      .subscribe((data) => {
        this.communityForm.reset();
        this.bottomSheet.dismiss(data);
      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();

      });
  }

  private loadSkills() {
    this.skillsService.getAllSkills().subscribe(skills => {
      this.allAvailableSkills = skills;
    }, (errorResponse: HttpErrorResponse) => {
      this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
      // Dirty fix because of: https://github.com/angular/angular/issues/17772
      this.changeDetector.markForCheck();
    });
  }

  private _filter(value: any): Skill[] {
    // the FormControl valueChanges event isn't reliably returning a String
    if (typeof value === 'object') {
      return this.allAvailableSkills;
    }

    const filterValue = value.toLowerCase();
    return this.allAvailableSkills.filter(skill => skill.name.toLowerCase().indexOf(filterValue) === 0);
  }

  get linkList() {
    return this.communityForm.get('links') as FormArray;
  }

  get skillsArray(): Skill[] {
    return this.communityForm.get('skills').value;
  }

}
