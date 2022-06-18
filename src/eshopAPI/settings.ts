import { environment as ENV } from "src/environments/environment"

export namespace Constants {
    export namespace Settings {
        export const SERVER: string = ENV.URL;
        export const SERVER_AUTH: string = ENV.URL_AUTH;
        export const URL_AUTH_PREFIX: string = ENV.URL_AUTH_PREFIX;
        export let USERGROUP_ID: string = ENV.USERGROUP_ID;
    }
}
