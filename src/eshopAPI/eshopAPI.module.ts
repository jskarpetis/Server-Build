import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Http2Eshop } from './http2Eshop';
import { AuthenticationAPI } from './api/authenticationAPI';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    Http2Eshop,
    AuthenticationAPI
  ],
})
export class eshopApiModule {
  constructor(@Optional() @SkipSelf() parentModule: eshopApiModule) {
    if (parentModule) {
      throw new Error(
        'Http2Eshop Module is already loaded. Import it in the AppModule only'
      );
    }
  }
}