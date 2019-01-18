import { ProjectsFilterPipe } from './projects-filter.pipe';

const projects = [
  {
    id: 'd11235de-f13e-4fd6-b5d6-9c4c4e18aa4f',
    name: 'test1',
    customer: 'customer1',
    industrySector: 'industry sector1',
    description: 'description1',
    creationDate: new Date(),
    lastModifiedDate: new Date()
  },
  {
    id: '6b7ebd19-4542-4c1d-9602-905e35b7f7f8',
    name: 'test2',
    customer: 'customer2',
    industrySector: 'industry sector2',
    description: 'description2',
    creationDate: new Date(),
    lastModifiedDate: new Date()
  }
];

describe('ProjectsFilterPipe', () => {

  const pipe = new ProjectsFilterPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the original list when the filter value is empty', () => {
    expect(pipe.transform(projects, '')).toEqual(projects);
  });

  it('should filter the list of projects', () => {
    expect(pipe.transform(projects, 'test1')).toEqual([projects[0]]);
  });
});
