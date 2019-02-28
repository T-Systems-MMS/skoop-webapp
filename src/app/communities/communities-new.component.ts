import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatBottomSheetRef, MatChipInputEvent,
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
import { debounceTime, distinctUntilChanged, filter, map, startWith, switchMap } from 'rxjs/operators';
import { User } from '../users/user';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-communities-new',
  templateUrl: './communities-new.component.html',
  styleUrls: ['./communities-new.component.scss']
})
export class CommunitiesNewComponent implements OnInit {

  @ViewChild('skillsAutoComplete') skillsMatAutocomplete: MatAutocomplete;
  @ViewChild('skillInput') skillAutocompleteInput: ElementRef<HTMLInputElement>;
  @ViewChild('usersInput') usersAutocompleteInput: ElementRef<HTMLInputElement>;
  @ViewChild('usersAutocomplete') usersMatAutocomplete: MatAutocomplete;

  communityForm: FormGroup;
  errorMessage: string = null;
  skills$: Observable<Skill[]> = of([]);
  userSuggestions$: Observable<User[]>;
  allAvailableSkills: Skill[];

  elemSelectable = true;
  elemRemovable = true;
  elemAddOnBlur = false;
  elemSeparatorKeysCodes = [COMMA, ENTER];
  skillAutocompleteCtrl = new FormControl();
  usersControl = new FormControl();

  constructor(private communityService: CommunitiesService,
              private usersService: UsersService,
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
    this.loadUsers();
    this.communityForm = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      type: new FormControl(CommunityType.OPENED),
      skills: new FormControl([]),
      description: new FormControl(''),
      links: new FormArray([]),
      invitedUsers: new FormControl([])
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

  addSelectedUser(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    if (value && this.usersArray.indexOf(value) === -1) {
      this.usersArray.push(value);
    }

    this.usersAutocompleteInput.nativeElement.value = '';
    this.usersControl.setValue(null);
  }

  removeUser(user: User): void {
    const index = this.usersArray.indexOf(user);
    if (index >= 0) {
      this.usersArray.splice(index, 1);
    }
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
      skillNames: this.skillsArray || [],
      description: this.communityForm.get('description').value,
      links: this.communityForm.get('links').value,
      invitedUserIds: (this.usersArray || []).map(item => item.id)
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

  private loadUsers() {
    this.userSuggestions$ = this.usersControl.valueChanges.pipe(
      filter(search => typeof search === 'string'),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(search => this.usersService.getUserSuggestions(search))
    );
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

  get linkList() {
    return this.communityForm.get('links') as FormArray;
  }

  get skillsArray(): string[] {
    return this.communityForm.get('skills').value;
  }

  get usersArray(): User[] {
    return this.communityForm.get('invitedUsers').value;
  }

}
