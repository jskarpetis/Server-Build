import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { LoginComponent } from './login.component';
import { LoginPageRoutingModule } from './login.routing';


@NgModule({
  declarations: [LoginComponent],
  imports: [LoginPageRoutingModule, SharedModule],
  providers: [],
  exports: [LoginComponent],
})
export class LoginModule {
  constructor() {}
}
