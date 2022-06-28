export interface GetProductsResponse {
    products?: Array<IProduct>;
}

export interface IProduct {
    id?: string;
    productName?: string;
    productCode?: string;
    releaseDate?: string;
    description?: string;
    price?: number;
    starRating?: number;
    imageUrl?:string;
    category?:string;
    tags?: Array<string>;
}

export interface IProductResolved{
    product: IProduct;
    error?: any;
}