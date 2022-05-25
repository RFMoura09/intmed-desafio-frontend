import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginFG = this.fb.group({
    user: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  goToAccount() {
    this.router.navigateByUrl('/account');
  }

  async login() {
    await this.authService.login({
      username: this.loginFG.get('user')?.value,
      password: this.loginFG.get('password')?.value,
    });
  }
}
