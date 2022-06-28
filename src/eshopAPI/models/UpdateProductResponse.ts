import { IProduct } from "./GetProductsResponse";
import { RegisterProductResponse } from "./RegisterProductResponse";

export interface UpdateProductResponse {
    status?: RegisterProductResponse
    product?: IProduct
}