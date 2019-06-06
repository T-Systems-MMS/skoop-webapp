import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherUserProfilesComponent } from './other-user-profiles.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../app-material.module';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { of } from 'rxjs';
import { UsersService } from '../users/users.service';
import { User } from '../users/user';
import { RouterTestingModule } from '@angular/router/testing';

const permissionOwners: User[] = [
  {
    id: 'e6b808eb-b6bd-447d-8dce-3e0d66b17759',
    userName: 'fius',
    firstName: 'first',
    lastName: 'user',
    email: 'first.user@skoop.io'
  },
  {
    id: '666808eb-b6bd-447d-8dce-3e0d66b17666',
    userName: 'seus',
    firstName: 'second',
    lastName: 'user',
    email: 'second.user@skoop.io'
  }
];

describe('OtherUserProfilesComponent', () => {
  let component: OtherUserProfilesComponent;
  let fixture: ComponentFixture<OtherUserProfilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        LayoutModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        AppMaterialModule,
        RouterTestingModule
      ],
      declarations: [OtherUserProfilesComponent],
      providers: [
        GlobalErrorHandlerService,
        {
          provide: UsersService, useValue: jasmine.createSpyObj('usersService', {
            'getPermissionOwnersByScope': of<User[]>(permissionOwners)
          })
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherUserProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the list of users who granted permission', () => {
    expect(component.permissionOwners).toEqual(permissionOwners);
  });
});
