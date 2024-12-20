import { Component, Host, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuitems: { label: string; icon: string; command: () => void }[];

  showLogin: boolean = false;
  showRegister: boolean = false;
  visible: boolean = false;
  formId: string | null = null;
  activeTab: string | null = 'general'; // 設定預設值為 'general'
  isLogin: any;
  isDropdownOpen = false;
  constructor(private router: Router, private user: UserService) {
    this.menuitems = [
      {
        label: '個人資訊',
        icon: 'pi pi-user',
        command: () => {
          this.router.navigateByUrl('personal');
        },
      },
    ];
  }
  
  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  @HostListener('document:click', ['$event'])

  onDocumentClick(event: Event) {
    this.isDropdownOpen = false;
  }
  viewProfile() {
    this.router.navigateByUrl('backend');
    this.isDropdownOpen = false;
  }

  logout() {
    this.user.logout();
    // 執行登出相關邏輯
    this.isDropdownOpen = false;
  }
  userInfo = this.user.currentUser;

  ngOnInit(): void {}

  home() {
    this.router.navigateByUrl(''); // 導航至首頁
  }

  showDialogLogin(this: any) {
    this.showLogin = true;
    return true
  }

  showDialogRegister() {
    this.showRegister = true;
  }

  showDialog(formId: string) {
    this.formId = formId;
    this.visible = true; // 開啟對話框
  }
}
