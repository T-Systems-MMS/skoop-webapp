import { async, TestBed } from '@angular/core/testing';

import { PublicationService } from './publication.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserIdentityService } from '../shared/user-identity.service';
import { of } from 'rxjs';
import { UserIdentity } from '../shared/user-identity';
import { environment } from '../../environments/environment';
import { PublicationRequest } from './publication-request';
import { PublicationResponse } from './publication-response';

const authenticatedUser: UserIdentity = {
  userId: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
  userName: 'tester',
  firstName: 'Toni',
  lastName: 'Tester',
  email: 'toni.tester@skoop.io',
  roles: ['ROLE_USER']
};

describe('PublicationService', () => {
  let httpTestingController: HttpTestingController;
  let publicationService: PublicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PublicationService,
        { provide: UserIdentityService, useValue: jasmine.createSpyObj('userIdentityService', {
            'getUserIdentity': of(authenticatedUser)
          })}
      ]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    publicationService = TestBed.get(PublicationService);
  });

  it('should be created', () => {
    expect(publicationService).toBeTruthy();
  });

  it('should create the publication with the given data', async(() => {
    const publicationRequest: PublicationRequest = {
      title: 'Publication title',
      date: new Date(),
      publisher: 'Publisher',
      link: 'https://www.google.com',
      skills: ['Skill1', 'Skill2']
    };

    const publicationResponse: PublicationResponse = {
      id: '123123123123123',
      title: publicationRequest.title,
      date: publicationRequest.date,
      publisher: publicationRequest.publisher,
      link: publicationRequest.link,
      skills: [
        {
          id: '1231231',
          name: 'Skill1'
        },
        {
          id: '4325345345',
          name: 'Skill2'
        },
      ]
    };

    publicationService.createPublication(publicationRequest).subscribe(actualData => {
      expect(actualData).toEqual(publicationResponse);
    });

    const request = httpTestingController.expectOne({
      method: 'POST',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/publications`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.body).toEqual(publicationRequest);

    request.flush(publicationResponse);
  }));

  it('should provide list of publications', async(() => {
    const publicationResponses: PublicationResponse[] = [
      {
        id: '18a30b9b-7d0d-4e50-a953-c643e085e071',
        title: 'sdfsdf',
        date: null,
        publisher: 'customer',
        'skills': []
      },
      {
        id: '369710e0-5808-4318-961e-0161f9f81f1c',
        title: 'withot',
        date: new Date(),
        publisher: 'adsad',
        link: '',
        skills: [
          {
            id: '1f5082a3-f7cf-4d6b-ad41-df8bce06e03f',
            name: 'Java',
            description: 'Java programming language.',
            skillGroups: null
          }
        ]
      }
    ];

    publicationService.getPublications().subscribe(actualData => {
      expect(actualData).toEqual(publicationResponses);
    });

    const request = httpTestingController.expectOne({
      method: 'GET',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/publications`
    });

    expect(request.request.responseType).toEqual('json');

    request.flush(publicationResponses);
  }));

  it('should update the publication with the given data', async(() => {
    const publicationRequest: PublicationRequest = {
      id: '123123123123123',
      title: 'Publication title',
      date: new Date(),
      publisher: 'Publisher',
      link: 'https://www.google.com',
      skills: ['Skill1', 'Skill2']
    };

    const publicationResponse: PublicationResponse = {
      id: publicationRequest.id,
      title: publicationRequest.title,
      date: publicationRequest.date,
      publisher: publicationRequest.publisher,
      link: publicationRequest.link,
      skills: [
        {
          id: '1231231',
          name: 'Skill1'
        },
        {
          id: '4325345345',
          name: 'Skill2'
        },
      ]
    };

    publicationService.editPublication(publicationRequest).subscribe(actualData => {
      expect(actualData).toEqual(publicationResponse);
    });

    const request = httpTestingController.expectOne({
      method: 'PUT',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/publications/${publicationRequest.id}`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.body).toEqual(publicationRequest);

    request.flush(publicationResponse);
  }));

  it('should delete the publication by its id', async(() => {
    const publicationId = '1231242134134124';
    publicationService.deletePublication(publicationId).subscribe(actualData => {
      expect(actualData).toBeNull();
    });

    const request = httpTestingController.expectOne({
      method: 'DELETE',
      url: `${environment.serverApiUrl}/users/${authenticatedUser.userId}/publications/${publicationId}`
    });

    expect(request.request.responseType).toEqual('json');

    request.flush(null);
  }));
});
