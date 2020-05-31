// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// import { KeycloakConfig } from 'keycloak-angular';

//  // Add here your keycloak setup infos
// const keycloakConfig: KeycloakConfig = {
//   url: 'https://login.etransafe.eu/auth',
//   realm: 'KH',
//   clientId: 'flame'
// };

export const environment = {
//   keycloakConfig,
  production: false,
  baseUrl: 'https://dev.kh.etransafe.eu/flame.kh.svc/api/v1',
  baseUrl_manage: 'https://dev.kh.etransafe.eu/flame.kh.svc/api/v1/manage/',
  baseUrl_build: 'https://dev.kh.etransafe.eu/flame.kh.svc/api/v1/build/',
  baseUrl_predict: 'https://dev.kh.etransafe.eu/flame.kh.svc/api/v1/predict/',
  baseUrl_smanage: 'https://dev.kh.etransafe.eu/flame.kh.svc/api/v1/smanage/',
  baseUrl_sbuild: 'https://dev.kh.etransafe.eu/flame.kh.svc/api/v1/sbuild/',
  baseUrl_search: 'https://dev.kh.etransafe.eu/flame.kh.svc/api/v1/search/'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
