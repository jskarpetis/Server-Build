import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ProductService } from "src/services/products.service";
import { BasePresenter } from "src/shared/base.presenter";


@Injectable({
    providedIn: 'root',
})
export class ProductsPresenter extends BasePresenter {

    private getProductsObserver: Subject<boolean> = new Subject();
    private getProductByIdObserver: Subject<boolean> = new Subject();

    constructor(
        private productsService: ProductService
    ) {
        super();
    }

    getProductsObserver$: Observable<any> = this.getProductsObserver.pipe();
    getProductByIdObserver$: Observable<any> = this.getProductByIdObserver.pipe();

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
}