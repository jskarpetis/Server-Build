import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductNewComponent } from './product-new.component';

const routes: Routes = [
  {
    path: '',
    component: ProductNewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ProductNewPageRoutingModule {}