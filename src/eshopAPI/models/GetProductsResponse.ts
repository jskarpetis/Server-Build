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
    tages?: Array<string>;
}