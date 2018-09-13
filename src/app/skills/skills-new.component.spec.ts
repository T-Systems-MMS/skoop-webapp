import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsNewComponent } from './skills-new.component';

describe('SkillsNewComponent', () => {
  let component: SkillsNewComponent;
  let fixture: ComponentFixture<SkillsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
