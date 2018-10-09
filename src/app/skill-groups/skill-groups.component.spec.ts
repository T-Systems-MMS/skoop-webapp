import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillGroupsComponent } from './skill-groups.component';

describe('GroupsComponent', () => {
  let component: SkillGroupsComponent;
  let fixture: ComponentFixture<SkillGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
