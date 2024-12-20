// user-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthStatusComponent } from '../../../modules/user/auth-status/auth-status.component';
import { ChangePasswordComponent } from '../../../modules/user/change-password/change-password.component';
import { PhoneSettingComponent } from '../../../modules/user/phone-setting/phone-setting.component';
import { ProfileComponent } from '../../../modules/user/profile/profile.component';
import { BackendComponent } from './backend.component';
import { PersonInfoComponent } from '../../../modules/user/person-info/person-info.component';
import { ReserveListComponent } from '../../../modules/reserve-list/reserve-list.component';

const userRoutes: Routes = [
  { path: 'backend', component: BackendComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'auth-status', component: AuthStatusComponent },
  { path: 'phone-setting', component: PhoneSettingComponent },
  { path: 'person-info', component: PersonInfoComponent },
  { path: 'reserve-list', component: ReserveListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)], // 使用 forChild 來配置模組路由
  exports: [RouterModule],
})
export class BackendRoutingModule {}
