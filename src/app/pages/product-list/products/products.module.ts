import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { ProductsComponent } from './products.component';
import { ProductsPageRoutingModule } from './products.routing';



@NgModule({
  declarations: [ProductsComponent],
  imports: [ProductsPageRoutingModule, SharedModule],
  providers: [],
  exports: [ProductsComponent],
})
export class ProductsModule {
  constructor() {}
}
