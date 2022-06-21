import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [],
})
export class AppComponent {
  pageTitle = 'Angular Routing Course';
  loading: boolean = true;

  // get isLoggedIn(): boolean {
  //   return this.authService.isLoggedIn;
  // }

  // get userName(): string {
  //   if (this.authService.currentUser) {
  //     return this.authService.currentUser.userName;
  //   }
  //   return '';
  // }

  // get isMessageDisplayed(): boolean {
  //   return this.messageService.isDisplayed;
  // }

  // constructor(private authService: AuthService, private router:Router, private messageService: MessageService) {
  //   router.events.subscribe((routerEvent: Event) => {
  //     this.checkRouterEvent(routerEvent);
  //   })
  //  }

  //  // Checking for events and setting the loading thing to true or false
  //  checkRouterEvent(routerEvent: Event): void {
  //    if (routerEvent instanceof NavigationStart) {
  //      this.loading = true;
  //    }

  //    if (routerEvent instanceof NavigationEnd ||
  //        routerEvent instanceof NavigationCancel ||
  //        routerEvent instanceof NavigationError) {
  //          this.loading = false;
  //        }
  //  }

  // displayMessages(): void {
  //   this.router.navigate([ { outlets: { popup: ['messages'] } }]);
  //   this.messageService.isDisplayed = true;
  // }

  // hideMessages(): void {
  //   this.router.navigate([ { outlets: { popup: null } }]); // Passing the value null clears the url from the secondary route
  //   this.messageService.isDisplayed = false;
  // }


  // logOut(): void {
  //   this.authService.logout(); //This line here sets the currentUser to null everything
  //   this.router.navigateByUrl("/welcome")  // Routing with code with the Router module, navigateByUrl makes sure that any parameter is set to null after we log out
     
  // }
}
