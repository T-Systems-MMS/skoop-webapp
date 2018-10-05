import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppMaterialModule } from '../app-material.module';
import { SkillUserComponent } from './skill-user.component';
import { By } from '@angular/platform-browser';

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
      userName: 'tester',
      currentLevel: 2,
      desiredLevel: 3,
      priority: 4
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly render the passed @Input value', () => {
    const h2 = fixture.debugElement.query(By.css('h2'));
    expect(h2.nativeElement.innerText).toBe(component.skillUser.userName);
  });

});
