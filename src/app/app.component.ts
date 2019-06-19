import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserIdentity } from './shared/user-identity';
import { UserIdentityService } from './shared/user-identity.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { NotificationCounterService } from './shared/notification-counter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe([
    Breakpoints.HandsetPortrait,
    Breakpoints.TabletPortrait
  ]).pipe(map(result => result.matches));
  userIdentity$: Observable<UserIdentity> = this.userIdentityService.getUserIdentity();
  @ViewChild('drawer', { static: true }) drawer: MatSidenav;
  notificationCount$: Observable<number> = this.notificationCounterService.getCount();

  constructor(private breakpointObserver: BreakpointObserver,
              private userIdentityService: UserIdentityService,
              private authService: OAuthService,
              private notificationCounterService: NotificationCounterService) {
    this.notificationCounterService.loadCount();
  }

  ngOnInit(): void {
  }

  onNavItemClick(): void {
    if (this.drawer.mode === 'over') { this.drawer.close(); }
  }

  public onLogout(): void {
    this.authService.logOut();
  }
}
