import { EnvironmentConfig } from './environment.config';

export const environment: EnvironmentConfig = {
  production: true,
  authentication: {
    issuer: document
      .querySelector('meta[name="myskills-config-authentication-issuer"]')
      .getAttribute('content'),
    clientId: 'myskills',
    scope: 'openid profile email',
    redirectUri: null,
    silentRefreshRedirectUri: null,
    requireHttps: document
      .querySelector('meta[name="myskills-config-authentication-insecure"]')
      .getAttribute('content') !== 'true'
  },
  serverApiUrl: document
    .querySelector('meta[name="myskills-config-server-api-url"]')
    .getAttribute('content')
};
