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
        queryParams: any,
        headers: HttpHeaders = null
    ): Promise<any> {
        return new Promise((resolve,reject) => {
            this.api.getProductById(headers,queryParams).then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            })
        })
    }

    public registerNewProduct(
        input: IProduct,
        headers: HttpHeaders = null
    ) : Promise<any> {
        return new Promise((resolve,reject) => {
            this.api.registerNewProduct(input,headers).then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            })
        })
    }

    public updateProduct(
        input: IProduct,
        headers: HttpHeaders = null
    ) : Promise<any> {
        return new Promise((resolve,reject) => {
            this.api.updateProduct(input,headers).then((result) => {
                resolve(result);
            })
            .catch((error) => {
                reject(error);
            })
        })
    }

    public deleteProduct(
        queryParams:any,
        headers: HttpHeaders = null
    ) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.api.deleteProduct(queryParams,headers).then((result) => {
                resolve(result);
            })
            .catch((error)=> {
                reject(error);
            })
        })
    }
}