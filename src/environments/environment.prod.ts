import { EnvironmentConfig } from './environment.config';

export const environment: EnvironmentConfig = {
  production: true,
  authentication: {
    issuer: document
      .querySelector('meta[name="skoop-config-authentication-issuer"]')
      .getAttribute('content'),
    clientId: 'skoop',
    scope: 'openid profile email',
    silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
    requireHttps: document
      .querySelector('meta[name="skoop-config-authentication-insecure"]')
      .getAttribute('content') !== 'true'
  },
  serverApiUrl: document
    .querySelector('meta[name="skoop-config-server-api-url"]')
    .getAttribute('content')
};
