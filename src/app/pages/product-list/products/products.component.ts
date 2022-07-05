import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/internal/operators";
import { GetProductsResponse, IProduct } from "src/eshopAPI/models/GetProductsResponse";
import { Values } from "src/eshopAPI/settings";
import { GlobalsService } from "src/services/globals.service";
import { BaseComponent } from "src/shared/base.component";
import { ProductsPresenter } from "../products.presenter";

@Component({
    templateUrl: './products.component.html',
    providers: [ProductsPresenter]
})
export class ProductsComponent extends BaseComponent implements OnInit {
    private _products: IProduct[]=[];
    private _listFilter = '';
    private _hasPrivilige:boolean;

    filteredProducts: IProduct[]=[];
    showImage = true;
    imageWidth = 50;
    imageMargin = 2;

    get hasPrivilige(): boolean {
        return this._hasPrivilige;
    }

    set hasPrivilige(bool:boolean){
        this._hasPrivilige = bool;
    }

    get listFilter(): string {
      return this._listFilter;
    }

    set listFilter(value: string) {
      this._listFilter = value;
      this.filteredProducts = this.listFilter ? this.performFilter(this.listFilter) : this.products;
    }
  
    set products(value:IProduct[]){
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
        this.hasPrivilige = this.globalService.isAdmin;
        this.presenter.getProductsObserver$.pipe(takeUntil(this.destroy)).subscribe((value) => {
            this.allProducts(value);
        });
        this.getAllProducts();
    }

    ngOnChange(){
        this.getAllProducts();
    }

    getAllProducts() {
        this.presenter.getProducts();
    }

    async allProducts(response: any){
        console.log(response);
        this.products = response.body;
        this.listFilter = '';
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
    performFilter(filterBy: string): IProduct[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.products.filter((product: IProduct) =>
          product.productName.toLocaleLowerCase().indexOf(filterBy) !== -1);
    }
    toggleImage(): void {
        this.showImage = !this.showImage;
      }
}

