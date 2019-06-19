import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDialogComponent } from './info-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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

describe('InfoDialogComponent', () => {
  let component: InfoDialogComponent;
  let fixture: ComponentFixture<InfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: communityData }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
