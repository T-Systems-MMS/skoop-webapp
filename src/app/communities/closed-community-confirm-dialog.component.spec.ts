import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedCommunityConfirmDialogComponent } from './closed-community-confirm-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';

describe('ClosedCommunityConfirmDialogComponent', () => {
  let component: ClosedCommunityConfirmDialogComponent;
  let fixture: ComponentFixture<ClosedCommunityConfirmDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosedCommunityConfirmDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedCommunityConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
