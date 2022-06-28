import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { StarComponent } from './star.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    // StarComponent
  ],
  exports: [
    // StarComponent,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
