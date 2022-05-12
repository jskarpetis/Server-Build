import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent {
  errorMessage: string; // This variable of type string stores the error Messages
  pageTitle = 'Log In';

  // Injecting the service AuthService
  constructor(private authService: AuthService, private router: Router) { }

  login(loginForm: NgForm): void {
    // If the form is valid and fulfilled then we try to login with the values given by the user
    if (loginForm && loginForm.valid) {
      const userName = loginForm.form.value.userName;
      const password = loginForm.form.value.password;
      // Logging in here (or trying to login)
      this.authService.login(userName, password);
      
      if (this.authService.redirectUrl) {
        this.router.navigate([this.authService.redirectUrl]);  
      }
      else{
        this.router.navigate(['/products']);
      }
      


      // Navigate to the Product List page after log in.
    } else {
      this.errorMessage = 'Please enter a user name and password.';
    }
  }
}
