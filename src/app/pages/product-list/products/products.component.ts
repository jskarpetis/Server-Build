import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/internal/operators";
import { GetProductsResponse } from "src/eshopAPI/models/GetProductsResponse";
import { Values } from "src/eshopAPI/settings";
import { GlobalsService } from "src/services/globals.service";
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
        public globalService: GlobalsService
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

    ProductById(id:string){
        console.log(id);
        this.globalService.id = id;
        this.router.navigateByUrl(`/products/?id=${id}`);
    }
    AddProduct(){
        this.router.navigateByUrl(`/products/register-new-product`);
    }
    EditProduct(id:string){
        this.globalService.id = id;
        this.router.navigateByUrl(`/products/edit/id=${id}`);
    }
}

