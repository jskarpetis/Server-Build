import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Http2Eshop } from "../http2Eshop";
import { Constants } from '../settings';
import Settings = Constants.Settings;

@Injectable({
    providedIn:'root',
})
export class AuthenticationAPI {
    constructor(private http2Eshop: Http2Eshop) {}
    
    public authenticateAdmin(input:any , headers: HttpHeaders = null){
        return this.http2Eshop.post({
            headers: headers,
            path: `${Settings.URL_AUTH_PREFIX}/signin`,
            input: input,
        })
    }
}

export interface AdminLoginInput{
    userName?: string;
    passWord?: string;
    userGroupId?:string;
}