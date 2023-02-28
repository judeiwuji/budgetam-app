import * as moment from 'moment';

export class Formats {
  static date(date: string) {
    return moment(new Date(date)).format('MMM Do YYYY');
  }
}
