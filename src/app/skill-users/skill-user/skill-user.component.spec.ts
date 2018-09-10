import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppMaterialModule } from '../../app-material.module';
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
        id: '9a96f28f-8f50-40d9-be1c-605aedd9dfc9',
        userName: 'tester'
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
});
