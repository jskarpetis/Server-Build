import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { takeUntil } from 'rxjs/internal/operators';
import { BaseComponent } from "src/shared/base.component";
import { InitPresenter } from "../init.presenter";
import { Constants } from 'src/eshopAPI/settings';
import Settings = Constants.Settings;

@Component({
  templateUrl: './login.component.html',
  styleUrls: [],
  providers: [InitPresenter],
})
export class LoginComponent extends BaseComponent implements OnInit {
    loginForm: FormGroup;
    errorMessage: string;

    constructor(
        public presenter: InitPresenter,
        private fb: FormBuilder,
        public router: Router
    ) {
        super(presenter, router);
    }

    ngOnInit(){
        this.loginForm = this.fb.group({
            userName : ["jskarpetis" , [Validators.required]],
            passWord : ["koko1234", [Validators.required]],
        });
        this.presenter.authenticateObserver$
        .pipe(
            // complete when component is destroyed
            takeUntil(this.destroy)
        )
        .subscribe((value) => {
            this.onLoginSubmitted(value);
        });
    }
    
    onLogin(): void {
        if(this.loginForm.invalid){
            return;
        }
        const username = this.loginForm.get('userName').value;
        const password = this.loginForm.get('passWord').value;

        const input: any = {
            userName: username,
            passWord: password,
            userGroupId: Settings.USERGROUP_ID,
        };
        this.loginForm.disable();
        this.presenter.login(input);
    }

    async onLoginSubmitted(response : any) {
        console.log(response);
    }
}
