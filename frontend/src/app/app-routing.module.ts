import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/public/login/login.component';
import { Error404Component } from './pages/public/error404/error404.component';

const routes: Routes = [
  { path: 'auth', component: AuthLayoutComponent },
  { path: '', pathMatch: 'full', component: LoginComponent },
  { path: '**', pathMatch: 'full', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
