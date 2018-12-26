import { EnvironmentConfig } from './environment.config';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: EnvironmentConfig = {
  production: false,
  authentication: {
    issuer: 'http://localhost:9000/auth/realms/MySkills',
    clientId: 'myskills',
    scope: 'openid profile email',
    redirectUri: null,
    silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
    requireHttps: false
  },
  serverApiUrl: 'http://localhost:4200/api'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
