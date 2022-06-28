export interface RegisterProductResponse {
    status?: number;
    statusText?: string;
    error?: {
        message?:string;
    }
}