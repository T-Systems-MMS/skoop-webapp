import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { GlobalErrorHandlerService } from '../error/global-error-handler.service';
import { map, filter } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { DeleteConfirmationDialogComponent } from '../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { SkillGroup } from './skill-group';
import { SkillGroupsService } from './skill-groups.service';
import { SkillGroupsNewComponent } from './skill-groups-new.component';
import { SkillGroupsEditComponent } from './skill-groups-edit.component';

@Component({
  selector: 'app-skill-groups',
  templateUrl: './skill-groups.component.html',
  styleUrls: ['./skill-groups.component.scss']
})
export class SkillGroupsComponent implements OnInit {

  skillGroups: SkillGroup[] = [];
  groupsFiltered: SkillGroup[] = [];
  errorMessage: string = null;

  constructor(private skillGroupsService: SkillGroupsService,
    private bottomSheet: MatBottomSheet,
    private changeDetector: ChangeDetectorRef,
    private globalErrorHandlerService: GlobalErrorHandlerService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadGroups();
  }

  private loadGroups(): void {
    this.skillGroupsService.getAllSkillGroups()
      .pipe(map(groups => groups.map<SkillGroup>(group => ({
        id: group.id,
        name: group.name,
        description: group.description
      }))))
      .subscribe(skillGroups => {
        this.skillGroups = skillGroups;
        this.groupsFiltered = skillGroups;
      }, (errorResponse: HttpErrorResponse) => {
        this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
        // Dirty fix because of: https://github.com/angular/angular/issues/17772
        this.changeDetector.markForCheck();
      });
  }

  openNewDialog(): void {
    this.bottomSheet.open(SkillGroupsNewComponent)
      .afterDismissed().pipe(filter(Boolean)).subscribe(() => this.loadGroups());
  }

  openEditDialog(skillGroup: SkillGroup): void {
    this.bottomSheet.open(SkillGroupsEditComponent, {
      data: <SkillGroup>{
        id: skillGroup.id,
        name: skillGroup.name,
        description: skillGroup.description
      }
    }).afterDismissed().pipe(filter(Boolean)).subscribe(() => this.loadGroups());
  }

  delete(skillGroup: SkillGroup): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '350px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.skillGroupsService.deleteSkillGroup(skillGroup.id)
          .subscribe(() => {
            this.loadGroups();
          }, (errorResponse: HttpErrorResponse) => {
            this.errorMessage = this.globalErrorHandlerService.createFullMessage(errorResponse);
            // Dirty fix because of: https://github.com/angular/angular/issues/17772
            this.changeDetector.markForCheck();
          });
      }
    });
  }

  applyFilter(filterValue: string) {
    const search: string = filterValue.trim().toLowerCase();
    this.groupsFiltered = this.skillGroups.filter((skillGroups) => {
      return this.searchInName(search, skillGroups) || this.searchInDescription(search, skillGroups);
    });
  }

  private searchInName(search: string, skillGroup: SkillGroup): boolean {
    return skillGroup.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
  }

  private searchInDescription(search: string, skillGroup: SkillGroup): boolean {
    if (skillGroup.description) {
      return skillGroup.description.toLowerCase().indexOf(search.toLowerCase()) > -1;
    }
    return false;
  }
}
