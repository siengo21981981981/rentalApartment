import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { timeStamp } from 'console';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  public registerForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '';
  isSuccess = false;
  @Input() type: string | null = null;
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    
  ) {}
  ngOnInit() {
   
    this.registerForm = this.fb.group({
      name: ['a', Validators.required],
      email: ['zxc5922956@gmail.com', [Validators.required, Validators.email]],
      password: ['aaaaaaa', [Validators.required, Validators.minLength(5)]],
      phone: ['a', Validators.required],
    });
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
  }
  get fc() {
    return this.registerForm.controls;
  }
  onSubmit() {
  this.isSubmitted = true;
  if (this.registerForm.invalid) return;

  this.userService
    .register({
      name: this.fc['name'].value,
      email: this.fc['email'].value,
      password: this.fc['password'].value,
      phone: this.fc['phone'].value,
    })
    .subscribe({
      next: () => {
        this.isSuccess = true;
        setTimeout(() => {
          this.isSuccess = false;
          window.location.reload(); // 或者您可以導航到其他頁面
        }, 3000); // 延遲 3 秒
      },
      error: (error) => {
        // 這裡可以添加錯誤處理
      },
    });
}
}
