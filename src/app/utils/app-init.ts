import { KeycloakService, KeycloakConfig } from 'keycloak-angular';

// import { environment } from '../../environments/environment';

const keycloakConfig: KeycloakConfig = {
    url: 'https://login.etransafe.eu/auth',
    realm: "KH",
    credentials: {
      secret: "99402d5f-897e-4e27-881e-85cb04f75601"
    },
    clientId: "knowledge-hub"
  };

export function initializer(keycloak: KeycloakService): () => Promise<any> {
  return (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      // const { keycloakConfig } = environment;
      try {
        await keycloak.init({
          config: keycloakConfig,
          // config: "/assets/keycloak.json",
          enableBearerInterceptor: true,
          bearerPrefix: 'Bearer', // Tima thinks capital might be important here

          // initOptions: {
          //   onLoad: 'login-required',
          //   checkLoginIframe: false
          // },
          // bearerExcludedUrls: []
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };
}
