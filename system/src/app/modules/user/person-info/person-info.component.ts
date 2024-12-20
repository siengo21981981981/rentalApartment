import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { max } from 'rxjs';

@Component({
  selector: 'app-person-info',
  templateUrl: './person-info.component.html',
  styleUrl: './person-info.component.scss',
})
export class PersonInfoComponent {
  isSubmitted: boolean = false;
  returnUrl = '';

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    
  ) {}
  user = this.userService.currentUser;
  userType = this.user.isLandlord;

  personInfoForm = this.fb.group({
    name: [this.user.name, [Validators.required]],
    username: [this.user.username,[Validators.required]],
    birthday: [this.user.birthday,[Validators.required]],
    phone: [this.user.phone, [Validators.maxLength(10), Validators.required]],
  });

  get fc() {
    return this.personInfoForm.controls;
  }
  submit() {
    this.isSubmitted = true;
    if (this.personInfoForm.invalid) return;
    this.userService
      .updatePersonInfo({
        name: this.fc['name'].value ?? '',
        username: this.fc['username'].value ?? '',
        birthday: this.fc['birthday'].value ?? '',
        phone: this.fc['phone'].value ?? '',
        token: this.user.token,
        isLandlord: this.user.isLandlord,
        isadmin: this.user.isadmin,
        properties: this.user.properties,
        _id: this.user._id,
        email: this.user.email,
        password: this.user.password
      })
      .subscribe({
        next: () => {
          
          this.router.navigateByUrl(this.returnUrl);
        },
        error: () => {
         window.alert('更新失敗');
        },
      });
  }
}
