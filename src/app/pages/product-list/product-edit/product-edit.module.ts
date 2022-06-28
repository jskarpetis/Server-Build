import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared.module';
import { ProductEditComponent } from './product-edit.component';
import { ProductEditPageRoutingModule } from './product-edit.routing';

@NgModule({
  declarations: [ProductEditComponent],
  imports: [ProductEditPageRoutingModule, SharedModule],
  providers: [],
  exports: [ProductEditComponent],
})
export class ProductEditModule {
  constructor() {}
}
