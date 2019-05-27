import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../users/user';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { ManagerService } from '../shared/manager.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-my-subordinates',
  templateUrl: './my-subordinates.component.html',
  styleUrls: ['./my-subordinates.component.scss']
})
export class MySubordinatesComponent implements OnInit {

  errorMessage: string = null;
  subordinates$: Observable<User[]> = of([]);

  constructor(private managerService: ManagerService,
              private router: Router, public activatedRoute: ActivatedRoute,
              private globalErrorHandlerService: GlobalErrorHandlerService) { }

  ngOnInit() {
    this.subordinates$ = this.managerService.getSubordinates()
      .pipe(
      catchError((err: HttpErrorResponse, caught: Observable<User[]>) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(err);
        return of([]);
      })
    );
  }

  openProjectMemberships(userId: string) {
    this.router.navigate([userId, 'project-memberships'], { relativeTo: this.activatedRoute });
  }

}
