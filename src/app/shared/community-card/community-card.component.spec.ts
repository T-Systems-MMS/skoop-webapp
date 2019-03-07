import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityCardComponent } from './community-card.component';
import { AppMaterialModule } from '../../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CommunityType } from '../../communities/community-type.enum';
import { CommunityResponse } from '../../communities/community-response';
import { By } from '@angular/platform-browser';

const community = {
  id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
  title: 'test1',
  type: CommunityType.OPENED,
  description: 'description1',
  links: [{
    name: 'google',
    href: 'https://www.google.com'
  },
    {
      name: 'stackoveflow',
      href: 'https://stackoverflow.com/'
    }],
  managers: [{id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759'}]
} as CommunityResponse;

describe('CommunityCardComponent', () => {
  let component: CommunityCardComponent;
  let fixture: ComponentFixture<CommunityCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        MatMomentDateModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [ CommunityCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityCardComponent);
    component = fixture.componentInstance;
    component.community = community;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title of community', () => {
    const communityTitle: HTMLElement = fixture.debugElement.query(By.css('.community-card__heading')).nativeElement;
    expect(communityTitle.textContent).toBe(community.title);
  });
});
