export interface EnvironmentConfig {
  production: boolean;
  authentication: {
    issuer: string;
    clientId: string;
    scope: string;
    redirectUri: string;
    silentRefreshRedirectUri: string;
    requireHttps: boolean | 'remoteOnly';
    postLogoutRedirectUri: string;
  };
  serverApiUrl: string;
}
