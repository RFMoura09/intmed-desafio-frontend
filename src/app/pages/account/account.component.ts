import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageTypeEnum } from 'src/app/models/messageTypeEnum';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  accountFG = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.email],
    password: ['', Validators.required],
    repeatPassword: [''],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {}

  isTheSamePassword() {
    return (
      this.accountFG.get('repeatPassword')?.value ==
      this.accountFG.get('password')?.value
    );
  }

  isEnabledSubmitButton() {
    return this.accountFG.valid && this.isTheSamePassword();
  }

  fieldHasError(fieldStr: string) {
    const field = this.accountFG.get(fieldStr)!;
    return (
      !!field.errors &&
      field.dirty &&
      (fieldStr === 'repeatPassword' ? this.isTheSamePassword() : true)
    );
  }

  goToLogin() {
    const isInProgress = Object.keys(this.accountFG.controls).some((key) => {
      return !!this.accountFG.get(key)?.value;
    });

    if (
      !isInProgress ||
      confirm('Tem certeza de que deseja descartar as alterações?')
    ) {
      this.router.navigateByUrl('/login');
    }
  }

  addUser() {
    this.authService.createUser({
      email: this.accountFG.get('email')!.value,
      username: this.accountFG.get('name')!.value,
      password: this.accountFG.get('password')!.value,
    });
    this.uiService.toastSubject.next({
      message: 'Usuário cadatrado com sucesso!',
      messageType: MessageTypeEnum.SUCCESS,
    });
    this.router.navigateByUrl('/login');
  }
}
