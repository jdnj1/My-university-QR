import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HeaderComponent } from './layouts/header/header.component';
import { LoginComponent } from './pages/public/login/login.component';
import { Error404Component } from './pages/public/error404/error404.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './pages/private/home/home.component';
import { AlertComponent } from './utils/alert/alert.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { QRCodeModule } from 'angularx-qrcode';
import { QrComponent } from './pages/private/qr/qr.component';
import { ConsultFormComponent } from './pages/private/consult-form/consult-form.component';
import { ViewComponent } from './pages/public/view/view.component';
import { UsersComponent } from './pages/private/users/users.component';
import { CreateUserComponent } from './pages/private/users/create-user/create-user.component';
import { EditUserComponent } from './pages/private/users/edit-user/edit-user.component';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslationComponent } from './layouts/translation/translation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangePassComponent } from './pages/private/users/change-pass/change-pass.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    AdminLayoutComponent,
    HeaderComponent,
    LoginComponent,
    Error404Component,
    HomeComponent,
    AlertComponent,
    SidebarComponent,
    QrComponent,
    ConsultFormComponent,
    ViewComponent,
    UsersComponent,
    CreateUserComponent,
    EditUserComponent,
    TranslationComponent,
    ChangePassComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    QRCodeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http);
        },
        deps: [ HttpClient ]
      }
    }),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
