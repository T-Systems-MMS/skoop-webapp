import { Pipe, PipeTransform } from '@angular/core';
import { Community } from './community';

@Pipe({
  name: 'communitiesFilter'
})
export class CommunitiesFilterPipe implements PipeTransform {

  transform(communities: Community[], searchTerm: string): Community[] {
    if (searchTerm == null || searchTerm === '') {
      return communities;
    }

    return communities.filter((community) => {
      return community.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

}
