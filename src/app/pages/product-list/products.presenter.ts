import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { IProduct } from "src/eshopAPI/models/GetProductsResponse";
import { ProductService } from "src/services/products.service";
import { BasePresenter } from "src/shared/base.presenter";


@Injectable({
    providedIn: 'root',
})
export class ProductsPresenter extends BasePresenter {

    private getProductsObserver: Subject<boolean> = new Subject();
    private getProductByIdObserver: Subject<boolean> = new Subject();
    private registerNewProductObserver: Subject<boolean> = new Subject();
    private updateProductObserver: Subject<boolean> = new Subject();
    private deleteProductObserver: Subject<boolean> = new Subject();

    constructor(
        private productsService: ProductService
    ) {
        super();
    }

    getProductsObserver$: Observable<any> = this.getProductsObserver.pipe();
    getProductByIdObserver$: Observable<any> = this.getProductByIdObserver.pipe();
    registerNewProductObserver$: Observable<any> = this.registerNewProductObserver.pipe();
    updateProductObserver$: Observable<any> = this.updateProductObserver.pipe();
    deleteProductObserver$:Observable<any> = this.deleteProductObserver.pipe();

    async getProducts() {
        const getProductsEnded = (result: any) =>{
            this.getProductsObserver.next(result);
        }

        const result = await this.productsService.getProducts().catch((error)=>{
            this.handleError(error);
        });

        if(!result){
            getProductsEnded(false);
            return;
        }
        getProductsEnded(result);
    }

    async getProdById(id:any) {
        const getProductByIdEnded = (result:any) =>{
            this.getProductByIdObserver.next(result);
        }

        const result = await this.productsService.getProductById(id).catch((error) => {
            this.handleError(error);
        });
        
        if(!result){
            getProductByIdEnded(false);
            return;
        }
        getProductByIdEnded(result);
    }

    async addProduct(input: IProduct){
        const addProductEnded = (result:any) => {
            this.registerNewProductObserver.next(result);
        }
        const result = await this.productsService.registerNewProduct(input).catch((error) => {
            this.handleError(error);
        })
        
        if(!result){
            addProductEnded(false);
            return;
        }
        addProductEnded(result);
    }

    async updateProduct(input: any){
        const updateProductEnded = (result: any) => {
            this.updateProductObserver.next(result);
        }
        const result = await this.productsService.updateProduct(input).catch((error) => {
            this.handleError(error);
        })
        
        if(!result){
            updateProductEnded(false);
            return;
        }
        updateProductEnded(result);
    }

    async deleteProduct(id:any){
        const deleteProductEnded = (result: any) => {
            this.deleteProductObserver.next(result);
        }

        const result = await this.productsService.deleteProduct(id).catch((error) => {
            this.handleError(error);
        })

        if(!result){
            deleteProductEnded(false);
            return;
        }
        deleteProductEnded(result);
    }
}