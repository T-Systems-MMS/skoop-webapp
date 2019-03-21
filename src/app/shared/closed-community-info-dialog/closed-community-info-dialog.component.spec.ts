import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedCommunityInfoDialogComponent } from './closed-community-info-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CommunityType } from '../../communities/community-type.enum';

const communityData = {
  id: '2134-5679-235235',
  title: 'community',
  description: 'community description',
  type: CommunityType.OPEN,
  skills: [],
  links: [
    {
      name: 'google',
      href: 'https://www.google.com'
    }
  ],
  managers: [{id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f'}],
  members: [{id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f'}]
};

describe('ClosedCommunityInfoDialogComponent', () => {
  let component: ClosedCommunityInfoDialogComponent;
  let fixture: ComponentFixture<ClosedCommunityInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosedCommunityInfoDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: communityData }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedCommunityInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
