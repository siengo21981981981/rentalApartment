import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneSettingComponent } from './phone-setting.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [PhoneSettingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DialogModule
  ],
  exports: [PhoneSettingComponent]
})
export class PhoneSettingModule { } 