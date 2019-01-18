import { Pipe, PipeTransform } from '@angular/core';
import { Project } from './project';

@Pipe({
  name: 'projectsFilter'
})
export class ProjectsFilterPipe implements PipeTransform {

  transform(projects: Project[], searchTerm: string): Project[] {
    if (searchTerm == null || searchTerm === '') {
      return projects;
    }

    return projects.filter((project) => {
      return project.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

}
