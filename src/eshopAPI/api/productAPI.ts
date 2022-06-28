import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Http2Eshop } from "../http2Eshop";
import { GetProductsResponse, IProduct } from "../models/GetProductsResponse";

@Injectable({
    providedIn: 'root',
})
export class ProductAPI{
    constructor(private http2Eshop: Http2Eshop) {}

    public getProducts(
        headers: HttpHeaders = null
    ): Promise<GetProductsResponse> {
        return this.http2Eshop.get({
            headers: headers,
            path: '/products',
            isAuth: false
        })
    }

    public getProductById(
        headers: HttpHeaders = null ,
        queryParams : any
    ) : Promise<IProduct> {
        return this.http2Eshop.get({
            headers: headers,
            path: `/products/${queryParams}`,
            isAuth: false
        })
    }

    public registerNewProduct(
        input:IProduct,
        headers: HttpHeaders = null 
    ) : Promise<any> {
        return this.http2Eshop.post({
            input: input,
            headers: headers,
            path: `/products/register-new-product`,
            isAuth: false
        })
    }

    public updateProduct(
        input: IProduct,
        headers: HttpHeaders = null
    ) : Promise<any> {
        console.log(input)
        return this.http2Eshop.patch({
            input:input,
            headers:headers,
            path: `update-product`,
            isAuth: false
        })
    }

    public deleteProduct(
        queryParams: any,
        headers: HttpHeaders = null
    ) : Promise<any> {
        return this.http2Eshop.delete({
            headers:headers,
            path: `delete-product/${queryParams}`,
            isAuth: false
        })
    }
}