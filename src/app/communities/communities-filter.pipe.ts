import { Pipe, PipeTransform } from '@angular/core';
import { CommunityResponse } from './community-response';
import { Skill } from '../skills/skill';

@Pipe({
  name: 'communitiesFilter'
})
export class CommunitiesFilterPipe implements PipeTransform {

  transform(communities: CommunityResponse[], searchTerm: string): CommunityResponse[] {
    if (searchTerm == null || searchTerm === '') {
      return communities;
    }

    const searchString = searchTerm.toLowerCase();
    return communities.filter((community) => {
      return community.title.toLowerCase().indexOf(searchString) > -1 || this.findInSkills(searchString, community.skills);
    });
  }

  private findInSkills(searchTerm: string, skills: Skill []): boolean {
    return skills != null && skills.find(skill => skill.name.toLowerCase().indexOf(searchTerm) > -1) != null;
  }

}
