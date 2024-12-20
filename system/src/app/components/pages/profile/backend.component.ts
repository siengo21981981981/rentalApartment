import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthStatusComponent } from '../../../modules/user/auth-status/auth-status.component';
import { ChangePasswordComponent } from '../../../modules/user/change-password/change-password.component';
import { PhoneSettingComponent } from '../../../modules/user/phone-setting/phone-setting.component';
import { ProfileComponent } from '../../../modules/user/profile/profile.component';
import { PersonInfoComponent } from '../../../modules/user/person-info/person-info.component';
import { ReserveListComponent } from '../../../modules/reserve-list/reserve-list.component';

@Component({
  selector: 'app-backend',
  templateUrl: './backend.component.html',
  styleUrls: ['./backend.component.scss'],
})
export class BackendComponent implements OnInit {
  iframeSrc: SafeResourceUrl;
  dropdowns = {
    dropdown1: false,
    dropdown2: false,
    dropdown3: false,
    dropdown4: false,
  };
  outletComponent: any = ReserveListComponent;

  constructor(
    private router: Router,
    private user: UserService,
    private sanitizer: DomSanitizer
  ) {
    // 初始設置iframe的URL
    this.iframeSrc = this.sanitizeUrl('reserve-list');
  }

  ngOnInit(): void {}

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  toggleDropdown(dropdownName: string) {
    this.dropdowns[dropdownName as keyof typeof this.dropdowns] =
      !this.dropdowns[dropdownName as keyof typeof this.dropdowns];
  }

  changeContent(route: string) {
    switch (route) {
      case 'person-info':
        this.outletComponent = PersonInfoComponent;
        break;
      case 'change-password':
        this.outletComponent = ChangePasswordComponent;
        break;
      case 'auth-status':
        this.outletComponent = AuthStatusComponent;
        break;
      case 'phone-setting':
        this.outletComponent = PhoneSettingComponent;
        break;
      case 'reserve-list':
        this.outletComponent = ReserveListComponent;
        break
      default:
        this.outletComponent = ProfileComponent;
    }
  }
}
