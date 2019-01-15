import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ProjectsService } from "../projects.service";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material";
import { Project } from "../project";

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {

  projectForm: FormGroup;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public project: Project,
              private projectService: ProjectsService,
              private formBuilder: FormBuilder,
              private bottomSheet: MatBottomSheetRef) {
    this.projectForm = formBuilder.group({
      name: new FormControl(project.name),
      customer: new FormControl(project.customer),
      industrySector: new FormControl(project.industrySector),
      description: new FormControl(project.description)
    });
  }

  ngOnInit() {
  }

  editProject() {
    this.projectService.updateProject(this.getProjectData())
      .subscribe(data => {
        this.bottomSheet.dismiss(true);
      }, err => {

      });
  }

  close() {
    this.bottomSheet.dismiss(true);
  }

  private getProjectData(): Project {
    return {
      id: this.project.id,
      name: this.projectForm.get('name').value,
      customer: this.projectForm.get('customer').value,
      industrySector: this.projectForm.get('industrySector').value,
      description: this.projectForm.get('description').value,
    } as Project;
  }

}
