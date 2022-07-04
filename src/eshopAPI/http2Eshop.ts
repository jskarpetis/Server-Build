import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from "@angular/router";
import { Constants, Values } from './settings';
import ESHeaders = Constants.ESHeaders;
import Settings = Constants.Settings;
@Injectable()
export class Http2Eshop{
    constructor(
        private http: HttpClient,
        private router:Router,
    ){}
    
    /**
     * 
     * @param path path of the request , contains only the path after the Server path ==> http//localhost:port/path
     * @param params query params
     * @param data_ 
     * @param headers extra headers of the request
     * @returns the final headers and right formated urlParams of the request
     */
    private getHeaders(
        path: string,
        params?: any,
        data_?: any,
        headers?: HttpHeaders,
      ): { headers: HttpHeaders; uRLSearchParams: HttpParams } {
        let result: HttpHeaders | undefined = headers;
        if (!result) result = new HttpHeaders();
    
        let getParams = new HttpParams();
        if (data_) {
          const json: any = JSON.stringify(data_);
        }
        //NOT TO SET FROM OUTSIDE
        // result = result.append(TAConstants.TAHeaders.FILL_RESOURCES, 'true');
        if (result.has(Constants.ESHeaders.CONTENT_TYPE) === false) {
          result.append(
            Constants.ESHeaders.CONTENT_TYPE,
            'application/json;charset=utf-8'
          );
        }
        // result = result.append('Allow-Control-Allow-Origin', 'http://localhost:4200/');
        // result = result.append("Access-Control-Allow-Headers", "Content-Type");
        // result = result.append("Access-Control-Allow-Methods", "POST");
        // result = result.append('Content-Type', 'multipart/form-data;');
        try {
          if (Values.Token && Values.Token != '')
            result = result.append(
              Constants.ESHeaders.AUTHORIZATION,
              `Bearer ${Values.Token}`
            );
          if (result.has(Constants.ESHeaders.APPLICATION_ID) === false)
            result = result.append(
              Constants.ESHeaders.APPLICATION_ID,
              Settings.APPLICATION_ID
            );
        } catch (error) {}
        // result = result.append(TAConstants.TAHeaders.SIGNATURE, signature);
        // result = result.append(TAConstants.TAHeaders.TIMESTAMP, currentTime);
    
        return { headers: result, uRLSearchParams: getParams };
      }
    
    /**
     * Format the request depending on needs of the server
     * @param request 
     * @returns Promise with the result of the request
     */
    private request(request: IHttp2EshopReq): Promise<any> {
        const clearAuth = () => {
            Values.Token = null;
            Values.Refresh = null;
            localStorage.clear();
            this.router.navigate(['/login'], { replaceUrl: true });
          };
        const result = this.getHeaders(
            request.path,
            request.queryParams,
            request.input,
            request.headers
        );
        const urlToCall: string = request.isAuth ? Constants.Settings.SERVER_AUTH + request.path : 
                                                   Constants.Settings.SERVER + request.path;
        const options = {
            body: request.input,
            headers: result.headers,
            params: result.uRLSearchParams,
            observe: 'response' as 'body' | 'events' | 'response'
        }
        return new Promise((resolve,reject) => {
            this.http.request(request.method, urlToCall, options).subscribe(
                (response) => {
                    const sendResult = (res: string) => {
                        let json = JSON.parse(res);
                        let headers = response.headers;
                        const headersToAdd = [
                            ESHeaders.APPLICATION_ID,
                          ];
                        if (headers) {
                            headersToAdd.forEach((h) => {
                              if (headers.has(h)) {
                                if (!json) json = [];
                                json[h] = headers.get(h);
                              }
                            });
                          }
                        resolve(json);
                    };
                    try {
                        if (
                          response &&
                          response.body &&
                          response.body != ''
                        ) {
                          // if (response && response.body && response.body != "" && true && !request.disableEncryption) {
                          // checkEncryption();
            
                          try {
                            sendResult(response);
                          } catch (err) {
                            resolve(response);
                          }
                        } else {
                          sendResult(response.body);
                        }
                      } catch (e) {
                        resolve(response.body);
                    }
                },
                (error) => {
                    reject(error || 'Server error');
                }
            )
        })
    }

    /**
     * Set GET method for incoming request
     * @param request 
     * @returns Formatted request with our parameters from settings and needed headers
     */
    public get(request: IHttp2EshopReq): Promise<any> {
        request.method = 'GET';
        return this.request(request);
    }

    /**
     * Set POST method for incoming request
     * @param request 
     * @returns Formatted request with our parameters from settings and needed headers
     */
    public post(request: IHttp2EshopReq): Promise<any> {
        request.method = 'POST';
        return this.request(request);
    }

    /**
     * Set DELETE method for incoming request
     * @param request 
     * @returns Formatted request with our parameters from settings and needed headers
     */
    public delete(request: IHttp2EshopReq): Promise<any> {
        request.method = 'DELETE';
        console.log(request);
        return this.request(request);
    }

    /**
     * Set PATCH method for incoming request
     * @param request 
     * @returns Formatted request with our parameters from settings and needed headers
     */
    public patch(request: IHttp2EshopReq): Promise<any> {
        request.method = 'PATCH';
        return this.request(request);
    }
}

export interface IHttp2EshopReq {
    method?: string;
    input?:any;
    headers?:HttpHeaders;
    path?:string;
    queryParams?: any;
    isAuth?:boolean;
}