import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule } from '@angular/router';

import { WelcomeComponent } from './home/welcome.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { AuthGuard } from './user/auth.guard';

// This module is used to group some of our routes to a different module in order to keep everything a bit clearer
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot([
      { path: "welcome", component: WelcomeComponent },  // We reference the components 
      { path: "products", canActivate: [AuthGuard], loadChildren: () => import('./products/product.module').then(mod => mod.ProductModule)}, // This is lazy loading 
      { path: "", redirectTo: "welcome", pathMatch: "full"},  // If we dont provide a path then we go to home(welcome) page
      { path: "**", component: PageNotFoundComponent }  // If no other path is specified then we navigate to the PageNotFound page
    ], { preloadingStrategy: PreloadAllModules}) // canLoad guard blocks any preloading, thats why we use canActivate instead
  ], 
  exports: [RouterModule] // We dont have the Router module on app.module anymore so we need to export it from here
})
export class AppRootingModule { }
