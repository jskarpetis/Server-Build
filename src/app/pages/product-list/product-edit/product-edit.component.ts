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
            productName : [],
            productCode : [],
            productPrice : []
        });
        this.editProduct.setValidators(this.atLeastOneValidator());
        this.presenter.updateProductObserver$
        .pipe(
            // complete when component is destroyed
            takeUntil(this.destroy)
        )
        .subscribe((value) => {
            this.savedProduct(value);
        });

        this.presenter.deleteProductObserver$
        .pipe(
            // complete when component is destroyed
            takeUntil(this.destroy)
        )
        .subscribe((value) => {
            this.deletedProduct(value);
        });
        
    }
    private atLeastOneValidator = () => {
        return (controlGroup) => {
            let controls = controlGroup.controls;
            if ( controls ) {
                let theOne = Object.keys(controls).find(key=> controls[key].value!=='');
                if ( !theOne ) {
                    return {
                        atLeastOneRequired : {
                            text : 'At least one should be selected'
                        }
                    }
                }
            }
            return null;
        };
    };

    async savedProduct(response:any){
        this.router.navigateByUrl('/products');
        console.log(response);
    }
    saveProduct(){
        if(this.editProduct.invalid){
            return;
        }
        const id = this.globalService.id;
        const productName = this.editProduct.get('productName').value;
        const productCode = this.editProduct.get('productCode').value;
        const productPrice = this.editProduct.get('productPrice').value;

        const input: any = {
            id:id,
        };
        if(productName)input.productName = productName ;
        if(productCode)input.productCode = productCode ;
        if(productPrice)input.productPrice = productPrice ;
        this.presenter.updateProduct(input);
    }

    cancel(){
        this.router.navigateByUrl('/products');
    }

    async deletedProduct(response:any){
        this.router.navigateByUrl('/products');
    }
    delete(){
        const id = this.globalService.id;
        this.presenter.deleteProduct(id);
    }
    
}

