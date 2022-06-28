import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared.module';
import { ProductNewComponent } from './product-new.component';
import { ProductNewPageRoutingModule } from './product-new.routing';



@NgModule({
  declarations: [ProductNewComponent],
  imports: [ProductNewPageRoutingModule, SharedModule],
  providers: [],
  exports: [ProductNewComponent],
})
export class ProductNewModule {
  constructor() {}
}