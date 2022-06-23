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
            path: `/products/${queryParams.id}`,
            isAuth: false
        })
    }
}