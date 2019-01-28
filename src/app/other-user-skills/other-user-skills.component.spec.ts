import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherUserSkillsComponent } from './other-user-skills.component';

describe('OtherUserSkillsComponent', () => {
  let component: OtherUserSkillsComponent;
  let fixture: ComponentFixture<OtherUserSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherUserSkillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherUserSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
