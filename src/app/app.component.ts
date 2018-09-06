import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserIdentityService } from './shared/user-identity.service';
import { UserIdentity } from './shared/user-identity';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  userIdentity$: Observable<UserIdentity> = this.userIdentityService.getUserIdentity();

  constructor(private breakpointObserver: BreakpointObserver, private userIdentityService: UserIdentityService) { }

  ngOnInit(): void { }
}
