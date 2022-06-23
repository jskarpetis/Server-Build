import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationAPI } from "src/eshopAPI/api/authenticationAPI";
import { AdminLoginResponse } from "src/eshopAPI/models/AdminLoginResponse";
import { Values } from "src/eshopAPI/settings";
@Injectable({
    providedIn: 'root',
  })
export class AuthenticationService {
    
    constructor(private api: AuthenticationAPI) {}

    private __autoAuthInput: any;//AuthenticateAdminInput

    get autoAuthInput() {
        return this.__autoAuthInput;
    }

    set autoAuthInput(value: any){
        this.__autoAuthInput = value;
    }

    public authenticateAdmin(
        input: any,
        headers: HttpHeaders = null
    ): Promise<AdminLoginResponse>{
        return new Promise((resolve, reject) => {
            this.api.authenticateAdmin(input,headers)
            .then((result) => {
                Values.Token = result.body.access_token;
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            })
        })
    }

}