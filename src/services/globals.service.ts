import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class GlobalsService {
    private _token:string = null;

    get token(){
        return this._token;
    }
    set token(value:string){
        this._token = value;
    }
}