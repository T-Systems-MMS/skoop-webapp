import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUserResultsComponent } from './search-user-results.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../app-material.module';
import { DownloadService } from './download.service';
import { of } from 'rxjs';
import { AnonymousUserSkill } from '../anonymous-user-skill';
import { By } from '@angular/platform-browser';

const anonymousUserSkills: AnonymousUserSkill[] = [
  {
    userReferenceId: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
    skills: [
      {
        skillName: 'Spring',
        currentLevel: 2
      },
      {
        skillName: 'Angular',
        currentLevel: 2
      }
    ]
  },
  {
    userReferenceId: '6b7ebd19-4542-4c1d-9602-905e35b7f7f8',
    skills: [
      {
        skillName: 'Spring',
        currentLevel: 4
      },
      {
        skillName: 'Angular',
        currentLevel: 3
      }
    ]
  }
];

describe('SearchUserResultsComponent', () => {
  let component: SearchUserResultsComponent;
  let fixture: ComponentFixture<SearchUserResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [SearchUserResultsComponent],
      providers: [
        {
          provide: DownloadService, useValue: jasmine.createSpyObj('downloadService', {
            'downloadAnonymousUserProfile': of<Blob>()
          })
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchUserResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill results form ', () => {
    component.userSkills = anonymousUserSkills;
    fixture.detectChanges();
    const searchResults = fixture.debugElement.queryAll(By.css('.search-users-card'));
    expect(searchResults.length).toBe(2);
  });

  it('should call downloadAnonymousUserProfile method ', async(() => {
    component.userSkills = anonymousUserSkills;
    fixture.detectChanges();
    const searchResults = fixture.debugElement.queryAll(By.css('.search-users-card'));
    const downloadButton = searchResults[0].query(By.css('button'));
    expect(downloadButton).toBeDefined();
    (downloadButton.nativeElement as HTMLElement).click();

    const downloadService = TestBed.get(DownloadService);
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(downloadService.downloadAnonymousUserProfile).toHaveBeenCalledWith(anonymousUserSkills[0].userReferenceId);
    });
  }));
});
