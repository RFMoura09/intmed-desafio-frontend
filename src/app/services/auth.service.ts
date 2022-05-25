import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../models/loginModel';
import { UserModel } from '../models/userModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  public getUsername(): string | null {
    return sessionStorage.getItem('username');
  }

  public getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  private saveUser(username: string, token: string) {
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('token', token);
  }

  public async login(user: LoginModel) {
    const { username, password } = user;

    const token = (
      await firstValueFrom<any>(
        this.http.post(environment.apiUrl + '/users/login', {
          username,
          password,
        })
      )
    ).token;

    this.saveUser(username, token);

    this.router.navigateByUrl('/home');
  }

  public logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }

  public async createUser(newUser: UserModel) {
    const { username, email, password } = newUser;
    return await firstValueFrom<any>(
      this.http.post(environment.apiUrl + '/users', {
        username,
        email,
        password,
      })
    );
  }
}
