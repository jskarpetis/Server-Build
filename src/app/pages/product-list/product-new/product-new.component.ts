import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { take, takeUntil } from "rxjs/internal/operators";
import { GetProductsResponse, IProduct } from "src/eshopAPI/models/GetProductsResponse";
import { Values } from "src/eshopAPI/settings";
import { GlobalsService } from "src/services/globals.service";
import { BaseComponent } from "src/shared/base.component";
import { ProductsPresenter } from "../products.presenter";


@Component({
    templateUrl: './product-new.component.html',
    providers: [ProductsPresenter,DatePipe]
})
export class ProductNewComponent extends BaseComponent implements OnInit {
    pageTitle = 'Add New Product';
    errorMessage: string = "Default";
    productForm: FormGroup;

    constructor(
        public presenter: ProductsPresenter,
        public router: Router,
        private fb: FormBuilder,
        public globalService: GlobalsService,
        private datePipe: DatePipe
    ) {
        super(presenter,router);
    }

    ngOnInit(): void {
        this.productForm = this.fb.group({
            productName : ["" , [Validators.required]],
            productCode : ["", [Validators.required]],
            description : [""],
            price : ["", [Validators.required]],
        });

        this.presenter.registerNewProductObserver$.pipe(
            takeUntil(this.destroy)
        )
        .subscribe((value) => {
            this.ProductAdded(value);
        })
    }

    addProduct() {
        if(this.productForm.invalid){
            return;
        }
        const productName = this.productForm.get('productName').value;
        const productCode = this.productForm.get('productCode').value;
        const description = this.productForm.get('description').value;
        const price = this.productForm.get('price').value;

        const input: IProduct = {
            productName: productName,
            productCode: productCode,
            description: description,
            releaseDate: this.datePipe.transform(new Date(), "mediumDate"),
            price:price,
            starRating: 0.0,
            category: "Gardening Tools",
            tags:[]
        };
        this.presenter.addProduct(input);
    }

    async ProductAdded(response){
        console.log(response);
    }

    Back(){
        this.router.navigateByUrl('/products');
    }

}

