import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { routes } from './app-routing.module';
import { searchBarComponent } from './components/partials/navbar/searchBar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeSelectModule } from 'primeng/treeselect';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { SlickCarouselModule } from 'ngx-slick-carousel';

// Components
import { HomeComponent } from './components/pages/home/home.component';
import { RentComponent } from './components/pages/rent/rent.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { RentalInfoComponent } from './components/pages/rental-info/rental-info.component';
import { RentalItemComponent } from './components/partials/rental-item/rental-item.component';
import { ReserveComponent } from './components/partials/reserve/reserve.component';
import { RentalItemResultComponent } from './components/partials/rental-item-result/rental-item-result.component';
import { BackendComponent } from './components/pages/profile/backend.component';
import { ChangePasswordComponent } from './modules/user/change-password/change-password.component';
import { PhoneSettingComponent } from './modules/user/phone-setting/phone-setting.component';
import { AuthStatusComponent } from './modules/user/auth-status/auth-status.component';
import { PersonInfoComponent } from './modules/user/person-info/person-info.component';
import { ProfileComponent } from './modules/user/profile/profile.component';
import { PublishBackendComponent } from './components/pages/publish-backend/publish-backend.component';
import { PublishComponent } from './modules/publishBackend/publish/publish.component';
import { UploadComponent } from './modules/publishBackend/upload/upload.component';
import { ReserveListComponent } from './modules/reserve-list/reserve-list.component';
import { MessageService } from 'primeng/api';
import { BackendRoutingModule } from './components/pages/profile/backend-routing.module';
import { ToastModule } from 'primeng/toast';
@NgModule({ 
  declarations: [
    AppComponent,
    HomeComponent,
    RentComponent,
    LoginComponent,
    RegisterComponent,
    RentalInfoComponent,
    HeaderComponent,
    FooterComponent,
    searchBarComponent,
    RentalItemComponent,
    ReserveComponent,
    RentalItemResultComponent,
    BackendComponent,
    ChangePasswordComponent,
    PhoneSettingComponent,
    AuthStatusComponent,
    PersonInfoComponent,
    ProfileComponent,
    PublishBackendComponent,
    PublishComponent,
    UploadComponent,
    ReserveListComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    TreeSelectModule,
    BrowserAnimationsModule,
    MultiSelectModule,
    ButtonModule,
    HttpClientModule,
    SlickCarouselModule,
    DialogModule,
    SplitButtonModule,
    BackendRoutingModule,
    TableModule,
    ToastModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
