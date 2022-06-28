import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductNewComponent } from '../product-new/product-new.component';
import { ProductsComponent } from './products.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
  },
  {
    path: "register-new-product", loadChildren: () =>
    import('../product-new/product-new.module').then(
      (m) => m.ProductNewModule
    )
  },
  {
    path: "edit/:id", loadChildren: () =>
    import('../product-edit/product-edit.module').then(
      (m) => m.ProductEditModule
    )
  },
  {
    path: ":id", component: ProductDetailComponent,
  },
  
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ProductsPageRoutingModule {}