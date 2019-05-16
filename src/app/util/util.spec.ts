import * as moment from 'moment';
import {Util} from './util';
import { UserProject } from '../user-projects/user-project';
import { Publication } from '../publications/publication';

describe('Util', () => {
  beforeEach(() => {
  });

  describe('.ignoreTimezone()', () => {
    it('returns null on null', () => {
      expect(Util.ignoreTimezone(null)).toBeNull();
    });

    it('strips UTC offset and preserves time of day',
      () => {
        const date = moment('2000-01-01T00:00').utc(true).utcOffset(120);
        const actual = Util.ignoreTimezone(date);

        expect(actual.utcOffset()).toEqual(0);
        expect(actual.format('YYYY-MM-DD HH:mm:ss')).toEqual('2000-01-01 02:00:00');
      });
  });

  describe('.datesAreConsistent()', () => {
    let userProject: UserProject;

    beforeEach(() => {
      userProject = {
        endDate: null,
        startDate: null,
        project: null,
        lastModifiedDate: null,
        creationDate: null,
        tasks: null,
        role: null,
        id: 1,
        user: null,
        skills: []
      };
    });

    it('allows empty "valid to"', () => {
      userProject.startDate = moment('2000-01-01');
      userProject.endDate = null;
      expect(Util.datesAreConsistent(userProject)).toBe(true);
    });

    it('allows "valid from" equals "valid to"', () => {
      userProject.startDate = moment('2000-01-01');
      userProject.endDate = moment('2000-01-01');
      expect(Util.datesAreConsistent(userProject)).toBe(true);
    });

    it('allows "valid from" before "valid to"', () => {
      userProject.startDate = moment('2000-01-01');
      userProject.endDate = moment('2000-01-02');
      expect(Util.datesAreConsistent(userProject)).toBe(true);
    });

    it('rejects "valid from" after "valid to"', () => {
      userProject.startDate = moment('2000-01-02');
      userProject.endDate = moment('2000-01-01');
      expect(Util.datesAreConsistent(userProject)).toBe(false);
    });

    it('rejects "valid to" before next day, when "valid from" is empty', () => {
      Util.injectNow(() => moment('2000-01-02'));

      userProject.startDate = null;
      userProject.endDate = moment('2000-01-01');
      expect(Util.datesAreConsistent(userProject)).toBe(false);
    });

    it('allows "valid to" on next day, when "valid from" is empty', () => {
      Util.injectNow(() => moment('2000-01-01'));

      userProject.startDate = null;
      userProject.endDate = moment('2000-01-02');
      expect(Util.datesAreConsistent(userProject)).toBe(true);
    });

    it('allows "valid to" after next day, when "valid from" is empty', () => {
      Util.injectNow(() => moment('2000-01-01'));

      userProject.startDate = null;
      userProject.endDate = moment('2000-01-03');
      expect(Util.datesAreConsistent(userProject)).toBe(true);
    });
  });

  describe('.dateIsInPast()', () => {

    const publication: Publication = {
      id: '123123',
      title: 'title',
      publisher: 'publisher'
    };

    it('allows empty publication date', () => {
      publication.date = null;

      expect(Util.dateIsInPast(publication)).toBeTruthy();
    });

    it('allows date before tomorrow', () => {
      Util.injectNow(() => moment('2000-01-02'));
      publication.date = new Date(2000, 0, 1); // 2000-01-01

      expect(Util.dateIsInPast(publication)).toBeTruthy();
    });

    it('rejects date after tomorrow', () => {
      Util.injectNow(() => moment('2000-01-02'));
      publication.date = new Date(2000, 0, 3); // 2000-01-03

      expect(Util.dateIsInPast(publication)).toBeFalsy();
    });
  });

});
