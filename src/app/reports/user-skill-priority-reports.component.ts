import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserSkillPriorityReportsService } from './user-skill-priority-reports.service';
import { UserSkillPriorityReportResponse } from './user-skill-priority-report-response';

@Component({
  selector: 'app-user-skill-priority-reports',
  templateUrl: './user-skill-priority-reports.component.html',
  styleUrls: ['./user-skill-priority-reports.component.scss']
})
export class UserSkillPriorityReportsComponent implements OnInit {
  priorityReports: UserSkillPriorityReportResponse[] = [];

  constructor(private userSkillPriorityReportsService: UserSkillPriorityReportsService,
    private router: Router, public activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loadUserSkillPriorityReports();
  }

  private loadUserSkillPriorityReports(): void {
    this.userSkillPriorityReportsService.getReports()
      .subscribe(priorityReports => this.priorityReports = priorityReports);
  }

  goDetails(id: Number) {
    this.router.navigate([id], { relativeTo: this.activatedRoute });
  }

  createReport() {
    this.userSkillPriorityReportsService.createRport().subscribe(newReport => {
      this.priorityReports.unshift(newReport);
    });
    // this.userSkillPriorityReportsService.getReports()
    //   .subscribe(priorityReports => this.priorityReports = priorityReports);
  }
}
