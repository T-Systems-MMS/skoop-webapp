import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationsNewComponent } from './publications-new.component';

describe('PublicationsNewComponent', () => {
  let component: PublicationsNewComponent;
  let fixture: ComponentFixture<PublicationsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicationsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
