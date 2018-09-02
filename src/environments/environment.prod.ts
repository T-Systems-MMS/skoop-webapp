export const environment = {
  production: true,
  authentication: {
    issuer: document.querySelector('meta[name="myskills-config-authentication-issuer"]').getAttribute('content'),
    clientId: 'myskills',
    scope: 'openid profile email',
    redirectUri: null,
    silentRefreshRedirectUri: null
  },
  serverApiUrl: document.querySelector('meta[name="myskills-config-server-api-url"]').getAttribute('content')
};
