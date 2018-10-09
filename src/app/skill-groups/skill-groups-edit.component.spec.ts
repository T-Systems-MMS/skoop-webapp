import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillGroupsEditComponent } from './skill-groups-edit.component';

describe('GroupsEditComponent', () => {
  let component: SkillGroupsEditComponent;
  let fixture: ComponentFixture<SkillGroupsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillGroupsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillGroupsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
