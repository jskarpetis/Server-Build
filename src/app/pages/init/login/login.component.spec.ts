import { HttpClient, HttpErrorResponse} from "@angular/common/http";
import { fakeAsync, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { RouterTestingModule } from '@angular/router/testing';
import { Http2Eshop, IHttp2EshopReq } from "src/eshopAPI/http2Eshop";


describe('Http2Eshop API', () => {
    let http: HttpClient;
    let httpcontroller: HttpTestingController;
    let http2Eshop: Http2Eshop;
    let tempToken: String;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports : [HttpClientTestingModule,RouterTestingModule],
            providers: [Http2Eshop]
        });
        http = TestBed.inject(HttpClient);
        httpcontroller = TestBed.inject(HttpTestingController);
        http2Eshop = TestBed.inject(Http2Eshop);
    });
    afterEach(() => {
        httpcontroller.verify();
    })
    it('API created',() => {
        expect(http2Eshop).toBeDefined();
    })

    it('API Login Request with valid User Credentials',fakeAsync(() => {
        const testData = true;
        let request = <IHttp2EshopReq>{} ;
        request.isAuth = true;
        request.path = "/login";
        request.input = {
            userName : 'jskarpetis',
            passWord: 'koko1234'
        }

        http2Eshop.post(request).then((data) => {
            expect(data.status).toEqual(200)
        });
        const req = httpcontroller.expectOne({method: 'POST', url: 'http://localhost:9003/login'});
        expect(req.request.method).toEqual('POST');
        req.flush({});
    }))

    it('API Login Request with invalid User Credentials',() => {
        const emsg = "User credentials are incorrect";
        let request = <IHttp2EshopReq>{} ;
        request.isAuth = true;
        request.path = "/login";
        request.input = {
            userName : 'jskarpetis',
            passWord: 'koko12'
        }

        http2Eshop.post(request).then(
            () => fail('Should have failed with 401 Unathorized'),
            (error: HttpErrorResponse) => {
                expect(error.status).toEqual(401, 'status');
                expect(error.error).toEqual(emsg, 'message');
            }
        );
        const req = httpcontroller.expectOne({method: 'POST', url: 'http://localhost:9003/login'});

        expect(req.request.method).toEqual('POST');
        
        req.flush(emsg, { status: 401, statusText: 'Unauthorized'})
    })

    it('API Login Request with Admin User Credentials',fakeAsync(() => {
        const testData = true;
        let request = <IHttp2EshopReq>{} ;
        request.isAuth = true;
        request.path = "/login";
        request.input = {
            userName : 'admin',
            passWord: 'admin'
        }

        http2Eshop.post(request).then((data)=> expect(data.status).toEqual(200));
        http2Eshop.post(request).then((data)=> expect(data.scope.includes('editing')).toEqual(true));
        const req = httpcontroller.match({method: 'POST', url: 'http://localhost:9003/login'});

        expect(req[1].request.method).toEqual('POST');
    }))

    it('API Get Products', () => {
        let request = <IHttp2EshopReq>{} ;
        request.isAuth = false;
        request.path = "/products";

        http2Eshop.get(request).then((data)=>console.log(data));
        const req = httpcontroller.match({method: 'GET', url: 'http://localhost:9002/products'});
        expect(req[0].request.method).toEqual('GET');
    })
})