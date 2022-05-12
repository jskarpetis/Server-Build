import { Injectable } from '@angular/core';

import { User } from './user';
import { MessageService } from '../messages/message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User;
  redirectUrl: string;

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  constructor(private messageService: MessageService) { }

  login(userName: string, password: string): void {
    if (!userName || !password) {
      // If either of those are false then we add a message using the messageService
      this.messageService.addMessage('Please enter your userName and password');
      return;
    }
    if (userName === 'admin') {
      // If the userName is admin then we update the currentUser instance of User
      this.currentUser = {
        id: 1,
        userName,
        isAdmin: true
      };
      // Then we add the message to the message list 
      this.messageService.addMessage('Admin login');
      return;
    }
    // If the user is not logged in as admin then he is a normal user 
    this.currentUser = {
      id: 2,
      userName,
      isAdmin: false
    };
    // And we add the message that the user is logged in 
    this.messageService.addMessage(`User: ${this.currentUser.userName} logged in`);
  }

  // Logging out when logout is called and the currentUser is null
  logout(): void {
    this.currentUser = null;
  }
}
