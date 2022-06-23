import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/internal/operators";
import { GetProductsResponse } from "src/eshopAPI/models/GetProductsResponse";
import { Values } from "src/eshopAPI/settings";
import { BaseComponent } from "src/shared/base.component";
import { ProductsPresenter } from "../products.presenter";


@Component({
    templateUrl: './products.component.html',
    providers: [ProductsPresenter]
})
export class ProductsComponent extends BaseComponent implements OnInit {

    private _products: GetProductsResponse ;

    set products(value:GetProductsResponse){
        this._products = value;
    }

    get products(){
        return this._products;
    }

    constructor(
        public presenter: ProductsPresenter,
        public router: Router,
    ) {
        super(presenter,router);
    }

    ngOnInit(): void {
        this.presenter.getProductsObserver$.pipe(takeUntil(this.destroy)).subscribe((value) => {
            this.allProducts(value);
        });
        this.getAllProducts();
        console.log(Values.Token);
    }

    getAllProducts() {
        this.presenter.getProducts();
    }

    async allProducts(response: any){
        console.log(response);
        this.products = response.body;
    }
}

