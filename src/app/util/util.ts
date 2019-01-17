import * as moment from 'moment';
import { Moment } from 'moment';
import { UserProject } from '../user-projects/user-project';

export class Util {

  /**
   * Sets the timezone to UTC without applying any timezone offset.
   * For example for 2000-01-01T00:00+02 (CEST) the method will return 2000-01-01T00:00Z (UTC).
   *
   * @param - {Moment} originalDate
   * @returns - {Moment}
   */
  public static ignoreTimezone(originalDate: Moment | Date): Moment {
    if (originalDate == null) {
      return null;
    } else {
      return moment(originalDate).utc(true);
    }
  }

  static injectNow(supplier: () => Moment) {
    Util.now = supplier;
  }

  private static now: () => Moment = () => Util.ignoreTimezone(moment());

  public static datesAreConsistent(userProject: UserProject): boolean {
    const from = Util.ignoreTimezone(userProject.startDate);
    const to = Util.ignoreTimezone(userProject.endDate);
    if (to == null) {
      return true;
    }

    if (from == null) {
      const today: Moment = Util.now().startOf('day');
      return !today.isAfter(to);
    } else {
      return !from.isAfter(to);
    }
  }

}
