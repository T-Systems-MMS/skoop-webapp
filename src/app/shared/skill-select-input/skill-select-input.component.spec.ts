import { async, ComponentFixture, discardPeriodicTasks, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { SkillSelectInputComponent } from './skill-select-input.component';
import { SkillsService } from '../../skills/skills.service';
import { of } from 'rxjs';
import { Skill } from '../../skills/skill';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../app-material.module';
import { By } from '@angular/platform-browser';
import { ENTER } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';

const skills = [
  {
    id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
    name: 'Angular',
    description: 'JavaScript Framework'
  },
  {
    id: 'c9b80869-c6bd-327d-u9ce-ye0d66b17129',
    name: 'Spring Boot',
    description: 'A Java Framework'
  }
];

describe('SkillSelectInputComponent', () => {
  let component: SkillSelectInputComponent;
  let fixture: ComponentFixture<SkillSelectInputComponent>;
  // to test autocomplete features
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [ SkillSelectInputComponent ],
      providers: [
        {
          provide: SkillsService,
          useValue: jasmine.createSpyObj('skillsService', {'getAllSkills': of<Skill[]>(skills)})
        },
      ]
    })
    .compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillSelectInputComponent);
    component = fixture.componentInstance;
    component.parentForm = new FormGroup({
      skills: new FormControl([])
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter skills based on input', fakeAsync(() => {
    sendInput('Angular');

    const options = overlayContainerElement.querySelectorAll('mat-option');
    expect(options.length).toBe(1);
    expect(options[0].innerHTML).toContain('Angular');

    discardPeriodicTasks();
  }));

  it('should add skill to the skills list', fakeAsync(() => {
    sendInput('Angular');

    const option = overlayContainerElement.querySelector('mat-option') as HTMLElement;
    tick();

    option.click();
    fixture.whenStable().then( () => {
      expect(component.skillsArray.length).toBe(1);
      expect(component.skillsArray[0]).toEqual(skills[0].name);
    });

    discardPeriodicTasks();
  }));

  it('should not add duplicated skills to the skills list', fakeAsync(() => {
    sendInput('Angular');

    let option = overlayContainerElement.querySelector('mat-option') as HTMLElement;
    tick();
    option.click();
    sendInput('Angular');
    option = overlayContainerElement.querySelector('mat-option') as HTMLElement;
    tick();
    option.click();

    fixture.whenStable().then( () => {
      expect(component.skillsArray.length).toBe(1);
      expect(component.skillsArray[0]).toEqual(skills[0].name);
    });

    discardPeriodicTasks();
  }));

  it('should add new elem to the skills array on enter click', () => {
    const value = 'new skill';
    expect(component.skillsArray.indexOf(value)).toBe(-1);

    const skillDebugElement = fixture.debugElement.query(By.css('#skillsChipList'));
    const inputNativeElement = skillDebugElement.nativeElement;

    inputNativeElement.value = value;

    const event = new KeyboardEvent('keydown', {
      keyCode: ENTER
    } as KeyboardEventInit);
    inputNativeElement.dispatchEvent(event);

    expect(component.skillsArray.indexOf(value)).not.toBe(-1);
  });

  it('should not add empty elem to the skills array on enter click', () => {
    const value = '      ';
    expect(component.skillsArray.length).toBe(0);

    const skillDebugElement = fixture.debugElement.query(By.css('#skillsChipList'));
    const inputNativeElement = skillDebugElement.nativeElement;

    inputNativeElement.value = value;

    const event = new KeyboardEvent('keydown', {
      keyCode: ENTER
    } as KeyboardEventInit);
    inputNativeElement.dispatchEvent(event);

    expect(component.skillsArray.length).toBe(0);
  });

  function sendInput(text: string) {
    let inputElement: HTMLInputElement;

    inputElement = component.skillAutocompleteInput.nativeElement;
    inputElement.value = text;
    component.skillAutocompleteCtrl.setValue(text);
    inputElement.dispatchEvent(new Event('focusin'));

    fixture.detectChanges();
  }
});
