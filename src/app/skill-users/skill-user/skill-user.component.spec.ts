import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillUserComponent } from './skill-user.component';

describe('SkillUserComponent', () => {
  let component: SkillUserComponent;
  let fixture: ComponentFixture<SkillUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
