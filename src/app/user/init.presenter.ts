import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { AuthenticationService } from "src/services/authentication.service";
import { BasePresenter } from "../shared/base.presenter";

@Injectable({
    providedIn: 'root',
})
export class InitPresenter extends BasePresenter{

    private authenticateObserver: Subject<boolean> = new Subject();

    constructor(protected authServ: AuthenticationService) {
        super();
    }

    authenticateObserver$: Observable<boolean> = this.authenticateObserver.pipe();

    async login(input: any){
        const loginFinished = (result: any) => {
            this.authenticateObserver.next(result);
        }

        const result = await this.authServ
        .authenticateAdmin(input)
        .catch((error) => {
            console.log(error)
        });

        if(!result){
            loginFinished(false);
            return;
        }
        loginFinished(result);
    }
}