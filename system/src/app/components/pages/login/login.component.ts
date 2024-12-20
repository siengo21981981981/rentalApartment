import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Header } from 'primeng/api';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public loginForm!: FormGroup;
  isSubmitted = false;
  islogin = false;  
  returnUrl = '';
  @Input() type: string | null = null;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required,],
    });
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
  }

  get fc() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) return;
    
    this.userService.login({ email: this.fc['email'].value, password: this.fc['password'].value }).subscribe(
      {
        next: (message) => {
          // this.messageService.success('message');
          
            
          
          this.islogin = true;
          this.router.navigateByUrl(this.returnUrl);
          window.location.reload();
        },
        error: (error) => {
          console.error(error);
          // this.messageService.error(error);
          window.alert('Email or password is incorrect');
        }
      }
    );
  }
}
