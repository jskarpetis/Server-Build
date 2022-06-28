import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/internal/operators";
import { GetProductsResponse, IProduct } from "src/eshopAPI/models/GetProductsResponse";
import { Values } from "src/eshopAPI/settings";
import { GlobalsService } from "src/services/globals.service";
import { BaseComponent } from "src/shared/base.component";
import { ProductsPresenter } from "../products.presenter";


@Component({
    templateUrl: './product-detail.component.html',
    providers: [ProductsPresenter]
})
export class ProductDetailComponent extends BaseComponent implements OnInit {
    pageTitle = 'Product Detail';
    _product: IProduct = null;
    errorMessage: string = "Default";

    set product(prod: IProduct){
        this._product = prod;
    }

    get product(){
        return this._product;
    }

    constructor(
        public presenter: ProductsPresenter,
        public router: Router,
        public globalService: GlobalsService
    ) {
        super(presenter,router);
    }

    ngOnInit(): void {
        this.presenter.getProductByIdObserver$.pipe(takeUntil(this.destroy)).subscribe((value) => {
            this.IdProduct(value);
        });
        this.getProductById();
    }

    getProductById(){
        this.presenter.getProdById(this.globalService.id);
    }

    async IdProduct(response){
        console.log(response);
        this.product = response.body;
    }
}

