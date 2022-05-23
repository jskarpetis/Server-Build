import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../../messages/message.service';

import { Product, ProductResolved } from '../product';
import { ProductService } from '../product.service';

@Component({
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  pageTitle = 'Product Edit';
  errorMessage: string;
  private dataIsValid: { [key: string]: boolean } = {};

  // In order to track the dirty state of two forms and not one
  private currentProduct: Product;
  private originalProduct: Product;

  // This checks if anything in the form is changed 
  get isDirty(): boolean {
    return JSON.stringify(this.originalProduct) !== JSON.stringify(this.currentProduct);
  }


  get product(): Product {
    return this.currentProduct;
  }

  // Using the setter. If our forms the user changes the product and those changes are applied to the currentProduct here
  set product(value: Product) {
    this.currentProduct = value;
    // Clone the product to retain a copy
    this.originalProduct = { ...value };
  }
  

  constructor(private productService: ProductService,
              private messageService: MessageService,
              private route: ActivatedRoute,
              private router: Router) { }



  ngOnInit(): void {

    // Using the route.paramMap observable we look for a change in the parameter id.
    
    this.route.data.subscribe( //Every time a variable changes(while we are not switching components) the observable gives a notification and executes the code 
      data => {
        //Pre-fetching the data for the edit buttons
        const resolvedData: ProductResolved = data['resolvedData'];
        this.errorMessage = resolvedData.error;
        this.onProductRetrieved(resolvedData.product);
      }
    )
    // const id = +this.route.snapshot.paramMap.get("id"); // We used this but when editing a product, if we clicked on add product it didn't do anything because the edit window didn't change 
    // this.getProduct(id);
  }

  onProductRetrieved(product: Product): void {
    this.product = product;

    if (!this.product) {
      this.pageTitle = 'No product found';
    } else {
      if (this.product.id === 0) {
        this.pageTitle = 'Add Product';
      } else {
        this.pageTitle = `Edit Product: ${this.product.productName}`;
      }
    }
  }

  deleteProduct(): void {
    if (this.product.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete(`${this.product.productName} was deleted`);
    } else {
      if (confirm(`Really delete the product: ${this.product.productName}?`)) {
        this.productService.deleteProduct(this.product.id).subscribe({
          next: () => this.onSaveComplete(`${this.product.productName} was deleted`),
          error: err => this.errorMessage = err
        });
      }
    }
  }

  saveProduct(): void {
    if (this.isValid()) {
      if (this.product.id === 0) {
        this.productService.createProduct(this.product).subscribe({
          next: () => this.onSaveComplete(`The new ${this.product.productName} was saved`),
          error: err => this.errorMessage = err
        });
      } else {
        this.productService.updateProduct(this.product).subscribe({
          next: () => this.onSaveComplete(`The updated ${this.product.productName} was saved`),
          error: err => this.errorMessage = err
        });
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
    
  }

  reset(): void {
    this.dataIsValid = null;
    this.currentProduct = null;
    this.originalProduct = null;
  }

  onSaveComplete(message?: string): void {
    
    
    if (message) {
      this.messageService.addMessage(message);
    }
    this.reset();
    this.router.navigate(["/products"]);
    
  }

  validate(): void {
    this.dataIsValid = {};

    // For the info tab
    if (this.product.productName && this.product.productName.length >=3 && this.product.productCode) {
      this.dataIsValid["info"] = true;
    }
    else {
      this.dataIsValid["info"] = false;
    }

    // For the tags tab
    if (this.product.category && this.product.category.length >= 3) {
      this.dataIsValid["tags"] = true;
    }
    else {
      this.dataIsValid["tags"] = false;
    }
  }

  isValid(path?: string): boolean {
    this.validate();
    if (path) {
      return this.dataIsValid[path];
    }
    return (this.dataIsValid && Object.keys(this.dataIsValid).every(data => this.dataIsValid[data] === true));
  }

  
}
