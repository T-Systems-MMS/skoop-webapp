export interface EnvironmentConfig {
  production: boolean;
  authentication: {
    issuer: string;
    clientId: string;
    scope: string;
    silentRefreshRedirectUri: string;
    requireHttps: boolean | 'remoteOnly';
  };
  serverApiUrl: string;
}
