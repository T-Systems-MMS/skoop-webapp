import { Component, OnInit } from '@angular/core';
import { ProjectsService } from "./projects.service";
import { MatBottomSheet } from "@angular/material";
import { NewProjectComponent } from "./new-project/new-project.component";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  constructor(private projectService: ProjectsService,
              private bottomSheet: MatBottomSheet) { }

  ngOnInit() {
  }

  openProjectDialog() {
    this.bottomSheet.open(NewProjectComponent)
  }

}
