import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from "@angular/router";
import { resourceLimits } from "worker_threads";
import { Constants } from './settings';
@Injectable()
export class Http2Eshop{
    constructor(
        private http: HttpClient,
        private router:Router
    ){}
    
    private getHeaders(
        path:string,
        params?:any,
        data_?:any,
        headers?: HttpHeaders
    ): { headers: HttpHeaders; urlSearchParams: HttpParams } {
        let result: HttpHeaders | undefined = headers;
        if(!result) result = new HttpHeaders();

        let getParams = new HttpParams();
        if(params !== undefined){
            
        }
        if(data_){
            const json: any = JSON.stringify(data_);
        }
        return {headers: result, urlSearchParams: getParams};
    }

    private request(request: IHttp2EshopReq): Promise<any> {
        const result = this.getHeaders(
            request.path,
            request.queryParams,
            request.input,
            request.headers
        )
        const urlToCall: string = Constants.Settings.SERVER + request.path;
        const options = {
            body: request.input,
            headers: result.headers,
            params: result.urlSearchParams,
            observe: 'response' as 'body' | 'events' | 'response'
        }
        return new Promise((resolve,reject) => {
            this.http.request(request.method, urlToCall, options).subscribe(
                (response) => {
                    const sendResult = (res: string) => {
                        let json = JSON.parse(res);
                        resolve(json);
                    }
                },
                (error) => {
                    reject(error || 'Server Error');
                }
            )
        })
    }

    public post(request: IHttp2EshopReq): Promise<any> {
        request.method = 'POST';
        return this.request(request);
    }
}

export interface IHttp2EshopReq {
    method?: string;
    input?:any;
    headers?:HttpHeaders;
    path?:string;
    queryParams?: any;

}