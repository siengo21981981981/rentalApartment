import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  isSubmitted: boolean = false;
  public pwdForm!: FormGroup;

  constructor(private userService: UserService, private fb: FormBuilder) {}
  user = this.userService.currentUser;
  ngOnInit(): void {
    this.pwdForm = this.fb.group(
      {
        oldPassword: [''],
        newPassword: [''],
        confirmPassword: [''],
      },
      {
        validator: this.checkPasswords,
      }
    );
  }

  get fc() {
    return this.pwdForm.controls;
  }
  checkPasswords(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value
    const confirmPassword = group.get('confirmPassword')?.value
    return newPassword === confirmPassword ? confirmPassword : {'mismatch': true}
  }
  updatePassword() {
    this.isSubmitted = true;
  }
  submit(){
    this.isSubmitted = true;
    if(this.pwdForm.invalid)return;
    this.userService.update({
      password: this.checkPasswords(this.pwdForm),
      id: this.user._id,
      email: this.user.email,
      phone: this.user.phone,
      username: this.user.username,
      name: this.user.name,
      birthday: this.user.birthday,
      token: this.user.token,
      isLandlord: this.user.isLandlord,
      isadmin: this.user.isadmin,
      properties: this.user.properties
    }).subscribe();
  }
}
