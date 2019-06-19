import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { WelcomeMessageCardComponent } from './welcome-message-card.component';
import { ExternalAssetsService } from '../../shared/external-assets.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../../shared/info-dialog/info-dialog.component';
import { NotificationType } from '../notification-type.enum';
import { UserWelcomeNotification } from './user-welcome-notification';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { AppMaterialModule } from '../../app-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageCardComponent } from '../message-card/message-card.component';
import { MessagesService } from '../messages.service';
import { DeleteConfirmationDialogComponent } from '../../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';

const welcomeNotification: UserWelcomeNotification =  {
  type: NotificationType.USER_WELCOME_NOTIFICATION,
  id: '997f8c9e-4655-47f7-8cf0-b6021b25405c',
  creationDatetime: new Date()
};

describe('WelcomeMessageCardComponent', () => {
  let component: WelcomeMessageCardComponent;
  let fixture: ComponentFixture<WelcomeMessageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        BrowserAnimationsModule,
        MatMomentDateModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [ WelcomeMessageCardComponent, InfoDialogComponent, MessageCardComponent, DeleteConfirmationDialogComponent ],
      providers: [
        {
          provide: ExternalAssetsService, useValue: jasmine.createSpyObj('templateLoaderService', {
            'loadTemplate': of('some html text')
          })
        },
        {
          provide: MessagesService, useValue: jasmine.createSpy()
        }
      ]
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [ InfoDialogComponent, DeleteConfirmationDialogComponent ]
        }
      })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeMessageCardComponent);
    component = fixture.componentInstance;
    component.notification = welcomeNotification;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain link to open welcome-notification information', fakeAsync(() => {
    fixture.detectChanges();
    const linkElem = fixture.debugElement.query(By.css(('div a')));
    expect(linkElem).not.toBeNull();
  }));

  it('should load html template and open welcome notification dialog on link click', fakeAsync(() => {
    const linkElem = fixture.debugElement.query(By.css(('div a')));
    linkElem.nativeElement.click();

    fixture.whenStable().then(() => {
      const templateLoader: ExternalAssetsService = TestBed.get(ExternalAssetsService);
      expect(templateLoader.getText).toHaveBeenCalled();

      const matDialog: MatDialog = TestBed.get(MatDialog);
      expect(matDialog.openDialogs.length).toBe(1);
      expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(InfoDialogComponent));
    });
  }));

  it('should open confirmation dialog on delete button click', fakeAsync(() => {
    component.delete(welcomeNotification);
    fixture.whenStable().then(() => {
      const matDialog: MatDialog = TestBed.get(MatDialog);
      expect(matDialog.openDialogs.length).toBe(1);
      expect(matDialog.openDialogs[0].componentInstance).toEqual(jasmine.any(DeleteConfirmationDialogComponent));
    });
  }));
});
