import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router"
import { Observable, of } from "rxjs"; 
import { catchError, map } from "rxjs/operators";
import { ProductResolved } from "./product";
import { ProductService } from "./product.service";

@Injectable({
    providedIn: "root"
})
// Resolvers are used to avoid partial page display to the user
// The resolver will return a structure product + error as defined in the product.ts
export class ProductResolver implements Resolve<ProductResolved> {

    constructor(private productService: ProductService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductResolved> {
        const id = route.paramMap.get("id");
        if (isNaN(+id)){
            const message = `Product id was not a number: ${id}`;
            console.log(message);
            // of() returns the object as an observable 
            return of({product: null, error: message});  // We have no valid product here so we return null and an error 
        }
        return this.productService.getProduct(+id) // Here we fetch the data for a product instead of doing it in the component/ we do not need to subscribe to the observable 
        .pipe(
            map(product => ({product: product})), // We dont have to define the error because it is optional
            catchError(error => {
                const message = `Retrieval error: ${error}`;
                console.log(message);
                return of({product: null, error: message});
            }
        ));
    }
}