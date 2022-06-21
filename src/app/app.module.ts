import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { ProductData } from './products/product-data';

import { AppComponent } from './app.component';
// import { WelcomeComponent } from './home/welcome.component';
import { PageNotFoundComponent } from './page-not-found.component';

/* Feature Modules */
// import { ProductModule } from './products/product.module';
// import { MessageModule } from './messages/message.module';
import { AppRootingModule } from './app-rooting.module';
import { eshopApiModule } from 'src/eshopAPI/eshopAPI.module';
import { LoginModule } from './pages/init/login/login.module';
import { InitPresenter } from './pages/init/init.presenter';



@NgModule({
  // Because we have declared these modules here we have access to all their paths from Router.forChild()
  // The paths from these modules have priority over the currents modules paths
  imports: [
    BrowserModule,
    HttpClientModule,
    // InMemoryWebApiModule.forRoot(ProductData, { delay: 1000 }), // We use this to simulate calls to a backend data service
    // ProductModule, // We are going to lazy load this productModule and we must not have a reference to it in the main module
    // MessageModule,
    eshopApiModule,
    LoginModule,
    HttpClientModule,
    AppRootingModule // When this is imported all its exports are available to the declared components, also this should be imported last
  ],

  declarations: [ 
    AppComponent,
    // WelcomeComponent,
    PageNotFoundComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
