import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { ProductDetailComponent } from './product-detail.component';
import { ProductDetailPageRoutingModule } from './product-detail.routing';



@NgModule({
  declarations: [ProductDetailComponent],
  imports: [ProductDetailPageRoutingModule, SharedModule],
  providers: [],
  exports: [ProductDetailComponent],
})
export class ProductDetailModule {
  constructor() {}
}