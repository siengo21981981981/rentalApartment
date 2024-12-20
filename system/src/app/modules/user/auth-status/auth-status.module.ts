import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStatusComponent } from './auth-status.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [AuthStatusComponent],
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule
  ],
  exports: [AuthStatusComponent]
})
export class AuthStatusModule { } 