import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/internal/operators";
import { GetProductsResponse, IProduct } from "src/eshopAPI/models/GetProductsResponse";
import { Values } from "src/eshopAPI/settings";
import { GlobalsService } from "src/services/globals.service";
import { BaseComponent } from "src/shared/base.component";
import { ProductsPresenter } from "../products.presenter";


@Component({
    templateUrl: './product-edit.component.html',
    providers: [ProductsPresenter]
})
export class ProductEditComponent extends BaseComponent implements OnInit {
    pageTitle = 'Product Edit';
    private _product: IProduct;
    private _newProduct: IProduct;
    private dataIsValid: { [key: string]:boolean } = {};
    errorMessage: string;
    editProduct: FormGroup;

    get isDirty():boolean {
        return JSON.stringify(this._newProduct) !== JSON.stringify(this._product);
    }

    get product(): IProduct {
        return this._product;
    }

    set product(prod:IProduct){
        this._product = prod;
        this._newProduct = {...prod};
    }

    constructor(
        public presenter: ProductsPresenter,
        public router: Router,
        public globalService: GlobalsService,
        private fb: FormBuilder,
    ) {
        super(presenter,router);
    }

    ngOnInit(): void {
        this.editProduct = this.fb.group({
            productName : ["" , [Validators.required]],
        });
        this.presenter.updateProductObserver$
        .pipe(
            // complete when component is destroyed
            takeUntil(this.destroy)
        )
        .subscribe((value) => {
            this.savedProduct(value);
        });

        
    }
    async savedProduct(response:any){
        console.log(response);
    }
    saveProduct(){
        if(this.editProduct.invalid){
            return;
        }
        const id = this.globalService.id;
        const productName = this.editProduct.get('productName').value;

        const input: any = {
            id:id,
            productName:productName
        };
        this.presenter.updateProduct(input);
    }
    
}

