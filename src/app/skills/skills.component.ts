import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Skill } from './skill';
import { SkillsService } from './skills.service';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MySkillsNewComponent } from '../my-skills/my-skills-new.component';
import { map, filter } from 'rxjs/operators';
import { MySkillsEditComponent } from '../my-skills/my-skills-edit.component';
import { SkillsNewComponent } from './skills-new.component';
import { SkillsEditComponent } from './skills-edit.component';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {

  skills: Skill[] = [];
  errorMessage: string = null;

  constructor(private skillsService: SkillsService,
    private bottomSheet: MatBottomSheet,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadSkills();
  }

  private loadSkills(): void {
    this.skillsService.getAllSkills()
      .pipe(map(skills => skills.map<Skill>(skill => ({
        id: skill.id,
        name: skill.name,
        description: skill.description
      }))))
      .subscribe(skills => {
        this.skills = skills;
      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  openNewDialog(): void {
    this.bottomSheet.open(SkillsNewComponent)
      .afterDismissed().pipe(filter(Boolean)).subscribe(() => this.loadSkills());
  }

  openEditDialog(skill: Skill): void {
    this.bottomSheet.open(SkillsEditComponent, {
      data: <Skill>{
        id: skill.id,
        name: skill.name,
        description: skill.description
      }
    }).afterDismissed().pipe(filter(Boolean)).subscribe(() => this.loadSkills());
  }

  delete(skill: Skill): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.skillsService.deleteSkill(skill.id)
          .subscribe(() => {
            this.loadSkills();
          }, (errorResponse: HttpErrorResponse) => {
            this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
            // Dirty fix because of: https://github.com/angular/angular/issues/17772
            this.changeDetector.markForCheck();
          });
      }
    });
  }

}
