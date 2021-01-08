import {KeycloakConfig, KeycloakEventType, KeycloakService} from 'keycloak-angular';
import {filter} from "rxjs/operators";

// const keycloakConfig: KeycloakConfig = {
//     url: 'https://login.etransafe.eu/auth',
//     realm: "KH",
//     credentials: {
//         secret: "****************************"
//     },
//     clientId: "knowledge-hub"
// };

// const keycloakConfig: KeycloakConfig = {
//     url: 'https://fc3ab282-kh-keycloak-d80a-832678220.eu-west-1.elb.amazonaws.com/auth/',
//     realm: "KH",
//     credentials: {
//         secret: "*****************************,
//     },
//     clientId: "knowledge-hub"
// };

export function initializer(keycloak: KeycloakService): () => Promise<any> {
    return (): Promise<any> => {

        // tell keycloak to get the token once it is expired
        // it updates the token like that but you can still have a scenario where you issue an http request
        // and the token has not yet been updated
        // therefore we have a
        // await keycloak.updateToken(100) before most of the http calls in our apps
        // I would have expected that this is something that angular-keycloak does automatically, but it doesn't seem to be the case
        keycloak.keycloakEvents$.pipe(filter(keycloak_event => keycloak_event.type === KeycloakEventType.OnTokenExpired)).subscribe(() => {
            console.log("Updating token");
            keycloak.updateToken(200);
        });

        return new Promise(async (resolve, reject) => {
            try {
                await keycloak.init({
                    // config: keycloakConfig,

                    config: "secrets/keycloak.json",
                    enableBearerInterceptor: true,
                    bearerPrefix: 'Bearer', // Tima thinks capital might be important here

                    // I'm not sure if the lines below are really needed
                    initOptions: {
                        onLoad: 'login-required',
                        // checkLoginIframe: false
                    }
                    /*bearerExcludedUrls: []*/
                });
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };
}
