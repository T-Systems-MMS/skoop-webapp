import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppMaterialModule } from '../app-material.module';
import { SkillUserComponent } from './skill-user.component';

describe('SkillUserComponent', () => {
  let component: SkillUserComponent;
  let fixture: ComponentFixture<SkillUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        AppMaterialModule
      ],
      declarations: [SkillUserComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillUserComponent);
    component = fixture.componentInstance;
    component.skillUser = {
      user: {
        userName: 'tester',
        firstName: 'Toni',
        lastName: 'Tester'
      },
      currentLevel: 2,
      desiredLevel: 3,
      priority: 4
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the user data passed as @Input value', () => {
    const h2 = fixture.debugElement.query(By.css('h2'));
    expect(h2.nativeElement.innerText).toContain(component.skillUser.user.firstName);
    expect(h2.nativeElement.innerText).toContain(component.skillUser.user.lastName);
    expect(h2.nativeElement.innerText).toContain(component.skillUser.user.userName);
  });

});
