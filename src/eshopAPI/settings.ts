import { environment as ENV } from "src/environments/environment"

export namespace Constants {
    export namespace Settings {
        export const SERVER: string = ENV.URL;
        export const SERVER_AUTH: string = ENV.URL_AUTH;
        export const URL_AUTH_PREFIX: string = ENV.URL_AUTH_PREFIX;
        export let USERGROUP_ID: string = ENV.USERGROUP_ID;
        export let APPLICATION_ID: string = ENV.APPLICATION_ID;
    }
    export namespace ESHeaders {
        export const APPLICATION_ID = 'Application-Id';
        export const ALLOW_CONTROL_ALLOW_ORIGIN = "Access-Control-Allow-Origin";
        export const CONTENT_TYPE = 'Content-Type';
        export const AUTHORIZATION = 'Authorization';
    }
}

export namespace Values {
    export let APPLICATION_ID: string;
    export let userName: string;
    export let Token: string;
    export let Refresh: string;
}
