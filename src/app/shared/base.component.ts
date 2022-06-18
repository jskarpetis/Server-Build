import { isNull } from 'lodash';
import { AfterViewInit, Injectable, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/internal/operators";
import { BasePresenter } from "./base.presenter";

@Injectable()
export class BaseComponent implements OnDestroy, AfterViewInit {

    destroy: Subject<void> = new Subject();

    constructor(
        protected presenter: BasePresenter,
        public router: Router,
    ){
        if(!isNull(presenter)){
            this.presenter.apiErrorObserver$
            .pipe(takeUntil(this.destroy))
            .subscribe((value) => this.apiErrorReceived(value));
        }
    }

    ngAfterViewInit(): void {}
    
    ngOnDestroy(): void {
        this.destroy.next();
        this.destroy.complete();
      }

    public apiErrorReceived(value: any) {}

    
}