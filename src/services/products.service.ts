import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ProductAPI } from "src/eshopAPI/api/productAPI";
import { GetProductsResponse, IProduct } from "src/eshopAPI/models/GetProductsResponse";


@Injectable({
    providedIn: 'root'
})
export class ProductService {
    constructor(private api: ProductAPI) {}

    public getProducts(
        headers: HttpHeaders = null
    ): Promise<GetProductsResponse> {
        return new Promise((resolve,reject) => {
            this.api.getProducts(headers)
            .then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            })
        })
    }

    public getProductById(
        headers: HttpHeaders = null,
        queryParams: any
    ): Promise<IProduct> {
        return new Promise((resolve,reject) => {
            this.api.getProductById(headers,queryParams)
        })
    }
}