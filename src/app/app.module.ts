import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { AccountComponent } from './pages/account/account.component';
import { LoaderComponent } from './components/loader/loader.component';
import { HomeComponent } from './pages/home/home.component';
import { NewAppointmentModalComponent } from './components/new-appointment-modal/new-appointment-modal.component';
import { UiControlsComponent } from './ui-controls/ui-controls.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastComponent } from './components/toast/toast.component';
import { BackendInterceptor } from './interceptors/backend.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AccountComponent,
    LoaderComponent,
    HomeComponent,
    NewAppointmentModalComponent,
    UiControlsComponent,
    ToastComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BackendInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
