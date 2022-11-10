import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http2Eshop } from '../http2Eshop';
import { GetProductsResponse, IProduct } from '../models/GetProductsResponse';
import { RegisterProductResponse } from '../models/RegisterProductResponse';
import { UpdateProductResponse } from '../models/UpdateProductResponse';

@Injectable({
  providedIn: 'root',
})
export class ProductAPI {
  constructor(private http2Eshop: Http2Eshop) {}

  /**
   * Get all the products from our protected recource
   * @param {HttpHeaders} headers if needed to add extra headers except defaults
   * @returns {Promise<GetProductsResponse>} Promise with all products
   */
  public getProducts(
    headers: HttpHeaders = null
  ): Promise<GetProductsResponse> {
    return this.http2Eshop.get({
      headers: headers,
      path: '/products',
      isAuth: false,
    });
  }

  /**
   * Get a product by a specific unique ID of its properties.
   * @param {HttpHeaders} headers extra headers if needed to be added
   * @param queryParams query params in order to pass the ID of product
   * @returns {Promise<IProduct>} Promise of type IProduct which contains a single product with the requested id
   */
  public getProductById(
    headers: HttpHeaders = null,
    queryParams: any
  ): Promise<IProduct> {
    return this.http2Eshop.get({
      headers: headers,
      path: `/products/${queryParams}`,
      isAuth: false,
    });
  }

  /**
   * Add a new Product in protected recource
   * @param {IProduct} input body of the request that contains the single product of type IProduct
   * @param {HttpHeaders} headers extra headers to be added for the request
   * @returns {Promise<RegisterProductResponse>} a Promise with a status and a description that inform us if POST was successful
   */
  public registerNewProduct(
    input: IProduct,
    headers: HttpHeaders = null
  ): Promise<RegisterProductResponse> {
    return this.http2Eshop.post({
      input: input,
      headers: headers,
      path: `/products/register-new-product`,
      isAuth: false,
    });
  }

  /**
   * Update a Product with a specific ID
   * @param input body of request containing the changed field of product always containing the id
   * @param headers extra headers addded
   * @returns {Promise<UpdateProductResponse>} Promise with information if the update was ended succefully
   */
  public updateProduct(
    input: IProduct,
    headers: HttpHeaders = null
  ): Promise<UpdateProductResponse> {
    return this.http2Eshop.patch({
      input: input,
      headers: headers,
      path: `/products/update-product`,
      isAuth: false,
    });
  }

  /**
   * Delete a Product with specific id
   * @param queryParams query parameters containing id of the product that we want to delete
   * @param headers extra headers that need to be added
   * @returns Promise with info about our delete process
   */
  public deleteProduct(
    queryParams: any,
    headers: HttpHeaders = null
  ): Promise<any> {
    return this.http2Eshop.delete({
      headers: headers,
      path: `/products/delete-product/${queryParams}`,
      isAuth: false,
    });
  }
}
