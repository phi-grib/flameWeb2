// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: true,
//   baseUrl_manage: '/api/v1/manage/',
//   baseUrl_build: '/api/v1/build/',
//   baseUrl_predict: '/api/v1/predict/',
//   baseUrl_smanage: '/api/v1/smanage/',
//   baseUrl_sbuild: '/api/v1/sbuild/',
//   baseUrl_search: '/api/v1/search/'
// };

export const environment = {
  production: true,
  read_only: false,
  baseUrl_manage: 'https://a05f2bb1dd55e4b78b61a78a780a5e5c-96677817.eu-west-1.elb.amazonaws.com/flame.kh.svc/api/v1/manage/',
  baseUrl_build: 'https://a05f2bb1dd55e4b78b61a78a780a5e5c-96677817.eu-west-1.elb.amazonaws.com/flame.kh.svc/api/v1/build/',
  baseUrl_predict: 'https://a05f2bb1dd55e4b78b61a78a780a5e5c-96677817.eu-west-1.elb.amazonaws.com/flame.kh.svc/api/v1/predict/',
  baseUrl_smanage: 'https://a05f2bb1dd55e4b78b61a78a780a5e5c-96677817.eu-west-1.elb.amazonaws.com/flame.kh.svc/api/v1/smanage/',
  baseUrl_sbuild: 'https://a05f2bb1dd55e4b78b61a78a780a5e5c-96677817.eu-west-1.elb.amazonaws.com/flame.kh.svc/api/v1/sbuild/',
  baseUrl_search: 'https://a05f2bb1dd55e4b78b61a78a780a5e5c-96677817.eu-west-1.elb.amazonaws.com/flame.kh.svc/api/v1/search/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
