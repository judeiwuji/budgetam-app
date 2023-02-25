import { environment } from 'src/environments/environment';

export class LinkManager {
  static get baseUrl() {
    if (environment.production) {
      return '';
    }
    return 'http://127.0.0.1:5002';
  }
}
