import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Constants } from 'src/eshopAPI/settings';
import { BaseComponent } from '../shared/base.component';
import { AuthService } from './auth.service';
import { InitPresenter } from './init.presenter';
import Settings = Constants.Settings;

@Component({
  templateUrl: './login.component.html',
  providers: [InitPresenter],
})
export class LoginComponent extends BaseComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string; // This variable of type string stores the error Messages
  pageTitle = 'Log In';

  // Injecting the service AuthService
  constructor(
    public presenter: InitPresenter,
    private fb: FormBuilder,
    private authService: AuthService, 
    public router: Router) { 
      super(presenter, router);
    }
  
  ngOnInit(){
    this.loginForm = this.fb.group({
      username : ["Alexandros Mikelis" , [Validators.required]],
      password : ["12341234", [Validators.required]],
    });

  }
  
  onLogin(loginForm: NgForm): void {
    // If the form is valid and fulfilled then we try to login with the values given by the user
    if (loginForm && loginForm.valid) {
      const userName = loginForm.form.value.userName;
      const password = loginForm.form.value.password;
      // Logging in here (or trying to login)
      const input: any = {
        username: userName,
        password: password,
        userGroupId: Settings.USERGROUP_ID,
      };
      this.presenter.login(input);


      // Navigate to the Product List page after log in.
    } else {
      this.errorMessage = 'Please enter a user name and password.';
    }
  }

  async onSubmmittedLogin(response : any) {
    if(response){
      if(response.token) {
        this.router.navigateByUrl('/products');
      }
    } else {
      {};
    }
  }
}
