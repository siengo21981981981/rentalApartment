import { Component } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { PublishComponent } from '../../../modules/publishBackend/publish/publish.component';
import { Router } from '@angular/router';
import { UploadComponent } from '../../../modules/publishBackend/upload/upload.component';

@Component({
  selector: 'app-publish-backend',
  templateUrl: './publish-backend.component.html',
  styleUrl: './publish-backend.component.scss',
})
export class PublishBackendComponent {
  constructor(private router: Router) {}
  iframeSrc!: SafeResourceUrl;
  dropdowns = {
    dropdown1: false,
    dropdown2: false,
    dropdown3: false,
    dropdown4: false,
  };
  outletComponent: any = UploadComponent;
  toggleDropdown(dropdownName: string) {
    this.dropdowns[dropdownName as keyof typeof this.dropdowns] =
      !this.dropdowns[dropdownName as keyof typeof this.dropdowns];
  }
  changeContent(route: string) {
    switch (route) {
      case 'upload':
        this.outletComponent = UploadComponent;
        break;
      case '':
        this.outletComponent = PublishComponent;
        break;
        
    }
  }
}
