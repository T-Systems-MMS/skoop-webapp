import { async, TestBed } from '@angular/core/testing';

import { CommunitiesService } from './communities.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { Community } from './community';
import { CommunityType } from './community-type.enum';

describe('CommunitiesService', () => {
  let httpTestingController: HttpTestingController;
  let service: CommunitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommunitiesService]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(CommunitiesService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const service: CommunitiesService = TestBed.get(CommunitiesService);
    expect(service).toBeTruthy();
  });

  it('should provide list of communities', async(() => {
    const testCommunities: Community[] = [
      {
        id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
        title: 'test1',
        description: 'description1',
        type: CommunityType.OPENED,
        links: [{
          name: 'google',
          href: 'https://www.google.com'
        },
          {
            name: 'stackoveflow',
            href: 'https://stackoverflow.com/'
          }]
      },
      {
        id: '6b7ebd19-4542-4c1d-9602-905e35b7f7f8',
        title: 'test2',
        description: 'description2',
        type: CommunityType.OPENED,
      }
    ];

    service.getCommunities().subscribe((communities) => {
      expect(communities).toEqual(testCommunities);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'GET'
      && req.url === `${environment.serverApiUrl}/communities`
    );

    expect(request.request.responseType).toEqual('json');

    request.flush(testCommunities);
  }));

  it('should provide a community', async(() => {
    const testCommunity: Community = {
      id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
      title: 'test1',
      description: 'description1',
      links: [{
        name: 'google',
        href: 'https://www.google.com'
      },
        {
          name: 'stackoveflow',
          href: 'https://stackoverflow.com/'
        }]
    } as Community;

    service.getCommunity(testCommunity.id).subscribe((community) => {
      expect(community).toEqual(testCommunity);
    });

    const request = httpTestingController.expectOne((req) =>
      req.method === 'GET'
      && req.url === `${environment.serverApiUrl}/communities/${testCommunity.id}`
    );

    expect(request.request.responseType).toEqual('json');

    request.flush(testCommunity);
  }));

  it('should update the community with the given data', async(() => {
    const testCommunity: Community = {
      id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
      title: 'test1',
      description: 'description1',
      links: [{
        name: 'google',
        href: 'https://www.google.com'
      },
        {
          name: 'stackoveflow',
          href: 'https://stackoverflow.com/'
        }]
    } as Community;

    service.updateCommunity(testCommunity).subscribe(community => {
      expect(community).toEqual(testCommunity);
    });

    const request = httpTestingController.expectOne({
      method: 'PUT',
      url: `${environment.serverApiUrl}/communities/${testCommunity.id}`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.body).toEqual(testCommunity);

    request.flush(testCommunity);
  }));

  it('should create the community with the given data', async(() => {
    const testCommunity: Community = {
      id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
      title: 'test1',
      description: 'description1',
      links: [{
        name: 'google',
        href: 'https://www.google.com'
      },
        {
          name: 'stackoveflow',
          href: 'https://stackoverflow.com/'
        }]
    } as Community;

    service.createCommunity(testCommunity).subscribe(community => {
      expect(community).toEqual(testCommunity);
    });

    const request = httpTestingController.expectOne({
      method: 'POST',
      url: `${environment.serverApiUrl}/communities`
    });

    expect(request.request.responseType).toEqual('json');
    expect(request.request.body).toEqual(testCommunity);

    request.flush(testCommunity);
  }));

  it('should delete the community', async(() => {
    const communityId = 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f';
    service.deleteCommunity(communityId).subscribe((data: any) => {
      expect(data).toBe(communityId);
    });

    const req = httpTestingController.expectOne({
      method: 'DELETE',
      url: `${environment.serverApiUrl}/communities/${communityId}`
    });
    expect(req.request.method).toBe('DELETE');

    req.flush(communityId);
  }));
});
