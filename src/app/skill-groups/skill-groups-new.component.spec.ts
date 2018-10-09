import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillGroupsNewComponent } from './skill-groups-new.component';

describe('GroupsNewComponent', () => {
  let component: SkillGroupsNewComponent;
  let fixture: ComponentFixture<SkillGroupsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillGroupsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillGroupsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
