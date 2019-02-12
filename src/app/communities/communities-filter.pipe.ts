import { Pipe, PipeTransform } from '@angular/core';
import { CommunityResponse } from './community-response';

@Pipe({
  name: 'communitiesFilter'
})
export class CommunitiesFilterPipe implements PipeTransform {

  transform(communities: CommunityResponse[], searchTerm: string): CommunityResponse[] {
    if (searchTerm == null || searchTerm === '') {
      return communities;
    }

    return communities.filter((community) => {
      return community.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

}
