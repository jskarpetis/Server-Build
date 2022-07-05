import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class GlobalsService {
    private _token:string = null;
    private _id:string = null;
    private _isAdmin: boolean = null;

    get token(){
        return this._token;
    }
    set token(value:string){
        this._token = value;
    }

    get id(){
        return this._id;
    }
    set id(id:string){
        this._id = id;
    }

    get isAdmin(){
        return this._isAdmin;
    }
    set isAdmin(bool:boolean){
        this._isAdmin = bool;
    }
}