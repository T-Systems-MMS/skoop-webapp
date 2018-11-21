import { LayoutModule } from '@angular/cdk/layout';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';
import { Observable, of } from 'rxjs';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { UserSkill } from '../user-skills/user-skill';
import { MySkillsNewComponent } from './my-skills-new.component';
import { MySkillsService } from './my-skills.service';

const mySkillsServiceStub: Partial<MySkillsService> = {
  getCurrentUserSkillSuggestions(search: string): Observable<string[]> { return null; },
  createCurrentUserSkill(skillName: string, currentLevel: number, desiredLevel: number, priority: number):
    Observable<UserSkill> { return null; }
};

const bottomSheetStub: Partial<MatBottomSheetRef> = {
  dismiss(result?: any): void { }
};

describe('MySkillsNewComponent', () => {
  let component: MySkillsNewComponent;
  let fixture: ComponentFixture<MySkillsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [MySkillsNewComponent],
      providers: [
        GlobalErrorHandlerService,
        { provide: MySkillsService, useValue: mySkillsServiceStub },
        { provide: MatBottomSheetRef, useValue: bottomSheetStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    spyOn(TestBed.get(MatBottomSheetRef) as MatBottomSheetRef, 'dismiss').and.callThrough();

    fixture = TestBed.createComponent(MySkillsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render skill suggestions for the given skill name input', fakeAsync(() => {
    // Spy on service methods used during interaction with the component.
    const mySkillsService = TestBed.get(MySkillsService) as MySkillsService;
    spyOn(mySkillsService, 'getCurrentUserSkillSuggestions').and.returnValue(of(['Spring Boot', 'Spring Security']));

    // Enter skill name and trigger change detection.
    const skillNameInput: HTMLInputElement = fixture.debugElement.query(By.css('#mySkillsNewDialog__skillNameInput')).nativeElement;
    skillNameInput.focus();
    skillNameInput.value = 'spr';
    skillNameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick();

    // Verify service call and rendering of autocomplete options.
    expect(mySkillsService.getCurrentUserSkillSuggestions).toHaveBeenCalledWith('spr');
    const autocompleteOptions = fixture.debugElement.queryAll(By.css('.mat-autocomplete-panel mat-option'));
    expect(autocompleteOptions.length).toBe(2);
    expect((autocompleteOptions[0].nativeElement as HTMLElement).textContent.trim()).toBe('Spring Boot');
    expect((autocompleteOptions[1].nativeElement as HTMLElement).textContent.trim()).toBe('Spring Security');
  }));

  it('should pass the input to the service when submitting the form', fakeAsync(() => {
    const testUserSkill: UserSkill = {
      skill: {
        id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
        name: 'Angular',
        description: 'JavaScript Framework'
      },
      currentLevel: 2,
      desiredLevel: 3,
      priority: 4
    };
    // Spy on service methods used during interaction with the component.
    const mySkillsService = TestBed.get(MySkillsService) as MySkillsService;
    spyOn(mySkillsService, 'getCurrentUserSkillSuggestions').and.returnValue(of(['Angular']));
    spyOn(mySkillsService, 'createCurrentUserSkill')
      .and.returnValue(of<UserSkill>(testUserSkill));

    // Enter skill name and trigger change detection.
    const skillNameInput: HTMLInputElement = fixture.debugElement.query(By.css('#mySkillsNewDialog__skillNameInput')).nativeElement;
    skillNameInput.focus();
    skillNameInput.value = 'Angular';
    skillNameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick();

    // Set the levels and priority on form control because there is no native way to interact with a Material slider.
    component.currentLevel.setValue(2);
    component.desiredLevel.setValue(3);
    component.priority.setValue(4);

    // Click add button and verify service call.
    const addButton: HTMLButtonElement = fixture.debugElement.query(By.css('#mySkillsNewDialog__addButton')).nativeElement;
    addButton.click();
    expect(mySkillsService.createCurrentUserSkill).toHaveBeenCalledWith('Angular', 2, 3, 4);
  }));

  it('should reset the form after successfully saving the user skill', fakeAsync(() => {
    const testUserSkill: UserSkill = {
      skill: {
        id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
        name: 'Angular',
        description: 'JavaScript Framework'
      },
      currentLevel: 2,
      desiredLevel: 3,
      priority: 4
    };
    // Spy on service methods used during interaction with the component.
    const mySkillsService = TestBed.get(MySkillsService) as MySkillsService;
    spyOn(mySkillsService, 'getCurrentUserSkillSuggestions').and.returnValue(of(['Angular']));
    spyOn(mySkillsService, 'createCurrentUserSkill')
      .and.returnValue(of<UserSkill>(testUserSkill));

    // Set the initial form control values.
    component.skillName.setValue('Angular');
    component.currentLevel.setValue(2);
    component.desiredLevel.setValue(3);
    component.priority.setValue(4);

    // Simulate clicking the add button and verify form control values.
    component.addUserSkill();
    tick();

    expect(component.skillName.value).toBe('');
    expect(component.currentLevel.value).toBe(0);
    expect(component.desiredLevel.value).toBe(0);
    expect(component.priority.value).toBe(0);
  }));
});
