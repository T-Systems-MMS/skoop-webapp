import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatBottomSheetRef,
  MatDialog
} from '@angular/material';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { finalize, map, startWith } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CommunitiesService } from './communities.service';
import { CommunityType } from './community-type.enum';
import { ClosedCommunityConfirmDialogComponent } from './closed-community-confirm-dialog.component';
import { CommunityRequest } from './community-request';
import { Observable, of } from 'rxjs';
import { Skill } from '../skills/skill';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SkillsService } from '../skills/skills.service';
import { CommunityResponse } from './community-response';

@Component({
  selector: 'app-communities-edit',
  templateUrl: './communities-edit.component.html',
  styleUrls: ['./communities-edit.component.scss']
})
export class CommunitiesEditComponent implements OnInit {

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

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public community: CommunityResponse,
              private communityService: CommunitiesService,
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
      title: new FormControl(this.community.title, Validators.required),
      type: new FormControl(this.community.type),
      skills: new FormControl(this.community.skills || []),
      description: new FormControl(this.community.description),
      links: new FormArray([])
    });

    if (this.community.links) {
      this.community.links.forEach(link => {
        this.linkList.push(this.formBuilder.group(
          {
            name: new FormControl(link.name, Validators.required),
            href: new FormControl(link.href, Validators.required)
          }));
      });
    }
  }

  addLink() {
    this.linkList.push(this.createLinkFormGroup());
  }

  removeLink(index) {
    this.linkList.removeAt(index);
    this.linkList.markAsDirty();
  }

  editCommunity() {
    const communityData = this.getCommunityData();
    if (communityData.type === CommunityType.OPENED || communityData.type === this.community.type) {
      this.innerEditCommunity(communityData);
    } else {
      const dialogRef = this.dialog.open(ClosedCommunityConfirmDialogComponent, {
        width: '350px',
        data: {}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.innerEditCommunity(communityData);
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
      this.communityForm.markAsDirty();
    }
  }

  selectSkill(event: MatAutocompleteSelectedEvent): void {
    const selectedSkill = event.option.value;
    if (!this.skillsArray.find(skill => skill.id === selectedSkill.id)) {
      this.skillsArray.push(selectedSkill);
      this.communityForm.markAsDirty();
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
      id: this.community.id,
      title: this.communityForm.get('title').value,
      type: this.communityForm.get('type').value,
      skillIds: (this.skillsArray || []).map(item => item.id),
      description: this.communityForm.get('description').value,
      links: this.communityForm.get('links').value,
      managerIds: (this.community.managers || []).map(item => item.id),
      memberIds: (this.community.members || []).map(item => item.id)
    } as CommunityRequest;
  }

  private innerEditCommunity(community: CommunityRequest) {
    this.communityService.updateCommunity(community)
      .pipe(
        finalize(() => {
            this.communityForm.markAsPristine();
          }
        )
      )
      .subscribe(data => {
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
