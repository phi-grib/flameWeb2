import {KeycloakConfig, KeycloakEventType, KeycloakService} from 'keycloak-angular';
import {filter} from "rxjs/operators";

// dummy config for development
const keycloakConfig: KeycloakConfig = {
    url: 'URL',
    realm: "KH",
    clientId: "knowledge-hub"
};

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
                    config: keycloakConfig,
                    enableBearerInterceptor: true,
                    bearerPrefix: 'Bearer', 
                });
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };
}
