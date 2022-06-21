import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { debounceTime } from 'rxjs/internal/operators';

@Injectable({
    providedIn:'root',
})
export class BasePresenter {
    private apiErrorObserver: Subject<any> = new Subject();

    apiErrorObserver$: Observable<any> = this.apiErrorObserver.pipe(
        debounceTime(300)
    );

    handleError(result: any) {
        const error = result ? result.errorMessage : {};
        this.apiErrorObserver.next(error);
    }
}