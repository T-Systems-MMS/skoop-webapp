import { async, ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AuthorizedUsersSelectComponent } from './authorized-users-select.component';
import { UsersService } from '../../users/users.service';
import { Observable, of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../app-material.module';
import { User } from '../../users/user';
import { UserRequest } from '../../users/user-request';
import { UserPermissionScope } from '../../users/user-permission-scope';
import { GlobalErrorHandlerService } from '../../error/global-error-handler.service';

const usersServiceStub: Partial<UsersService> = {
  getUser(): Observable<User> { return null; },
  updateUser(userData: UserRequest): Observable<User> { return null; },
  getAuthorizedUsers(scope: UserPermissionScope): Observable<User[]> { return null; },
  updateAuthorizedUsers(scope: UserPermissionScope, authorizedUsers: User[]): Observable<User[]> { return null; },
  getUserSuggestions(search: string): Observable<User[]> { return null; }
};

describe('AuthorizedUsersSelectComponent', () => {
  let component: AuthorizedUsersSelectComponent;
  let fixture: ComponentFixture<AuthorizedUsersSelectComponent>;

  beforeEach(async(() => {
    spyOn(usersServiceStub, 'getAuthorizedUsers')
      .and.returnValue(of<User[]>(
      [{
        id: '2736a204-f3ab-4b65-8568-a1c8ce1db8ab',
        userName: 'testing',
        firstName: 'Tina',
        lastName: 'Testing',
        email: 'tina.testing@skoop.io',
        coach: false,
      }]
    ));

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule
      ],
      declarations: [ AuthorizedUsersSelectComponent ],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceStub
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedUsersSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove a given user from the list of authorized users', () => {
    component.users = [{
      id: '2736a204-f3ab-4b65-8568-a1c8ce1db8ab',
      userName: 'testing',
      firstName: 'Tina',
      lastName: 'Testing',
      email: 'tina.testing@skoop.io',
      coach: false,
    },
      {
        id: '251c2a3b-b737-4622-8060-196d5e297ebc',
        userName: 'testbed',
        firstName: 'Tabia',
        lastName: 'Testbed',
        email: 'tabia.testbed@skoop.io',
        coach: false,
      }];
    component.onAuthorizedUserRemoved(component.users[0]);
    expect(component.users).toEqual([{
      id: '251c2a3b-b737-4622-8060-196d5e297ebc',
      userName: 'testbed',
      firstName: 'Tabia',
      lastName: 'Testbed',
      email: 'tabia.testbed@skoop.io',
      coach: false,
    }]);
  });


  it('should send getUserSuggestions request in 500 ms', fakeAsync(() => {
    const usersService = TestBed.get(UsersService) as UsersService;
    spyOn(usersService, 'getUserSuggestions').and.returnValue(of([]));

    component.authorizedUsersControl.setValue('test');
    tick(200);
    fixture.detectChanges();

    expect(usersService.getUserSuggestions).not.toHaveBeenCalled();

    tick(300);
    fixture.detectChanges();
    expect(usersService.getUserSuggestions).toHaveBeenCalled();

    discardPeriodicTasks();
  }));
});
