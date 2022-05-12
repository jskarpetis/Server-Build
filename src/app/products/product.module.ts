import { NgModule } from '@angular/core';

import { ProductListComponent } from './product-list.component';
import { ProductDetailComponent } from './product-detail.component';
import { ProductEditComponent } from './product-edit/product-edit.component'
import { ProductResolver } from './products-resolver.service';

import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ProductEditInfoComponent } from './product-edit/product-edit-info.component';
import { ProductEditTagsComponent } from './product-edit/product-edit-tags.component';
import { ProductEditGuard } from './product-edit/product-edit.guard';

// We have made a group of routes under a component less route
@NgModule({
  imports: [
    SharedModule,
    // Using a resolver we pre-fetch the data for the component thus increasing customer experience quality
    RouterModule.forChild([

      { path: "", component: ProductListComponent},

      { path: ":id", component: ProductDetailComponent, 
        resolve: { resolvedData: ProductResolver}}, // Importing the router module for this module too but forChild() this time, the path is accessible from anywhere in the app  
      
      { path: ":id/edit", component: ProductEditComponent, 
        canDeactivate: [ProductEditGuard],
        resolve: { resolvedData: ProductResolver},
        children: [
            // If the path is empty, default path displayed
            { path: "", redirectTo: "info", pathMatch: "full" },
            { path: "info", component: ProductEditInfoComponent }, // When the info key is given we display the component into the router outlet of the components template
            { path: "tags", component: ProductEditTagsComponent }
        ]} // Importing the router module for this module too but forChild() this time, the path is accessible from anywhere in the app
        
       // Importing the router module for this module too but forChild() this time, the path is accessible from anywhere in the app  
                                                                                                                
    ])
  ],
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductEditComponent,
    ProductEditInfoComponent,
    ProductEditTagsComponent
    
  ]
})
export class ProductModule { }
