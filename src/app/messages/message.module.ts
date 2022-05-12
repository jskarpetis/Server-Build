import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { MessageComponent } from './message.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: "messages", component: MessageComponent, outlet: "popup"} // Defining a secondary route with the name popup
    ])
  ],
  declarations: [
    MessageComponent
  ]
})
export class MessageModule { }
