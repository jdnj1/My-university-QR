import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/public/login/login.component';
import { Error404Component } from './pages/public/error404/error404.component';
import { HomeComponent } from './pages/private/home/home.component';
import { authGuard } from './guards/auth.guard';
import { QrComponent } from './pages/private/qr/qr.component';
import { ConsultFormComponent } from './pages/private/consult-form/consult-form.component';
import { ViewComponent } from './pages/public/view/view.component';
import { UsersComponent } from './pages/private/users/users.component';
import { CreateUserComponent } from './pages/private/users/create-user/create-user.component';
import { EditUserComponent } from './pages/private/users/edit-user/edit-user.component';
import { ChangePassComponent } from './pages/private/users/change-pass/change-pass.component';
import { insideGuard } from './guards/inside.guard';
import { changesGuard } from './guards/changes.guard';

const routes: Routes = [
  { path: 'auth', component: AuthLayoutComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'codeQr/:id', component: QrComponent, canActivate: [authGuard], canDeactivate: [changesGuard] },
  { path: 'consult/:idQr/:idCon', component: ConsultFormComponent, canActivate: [authGuard], canDeactivate: [changesGuard] },
  { path: 'users-list', component: UsersComponent, canActivate: [authGuard], data: {role: 1} },
  { path: 'create-user', component: CreateUserComponent, canActivate: [authGuard], data: {role: 1}, canDeactivate: [changesGuard]},
  { path: 'edit-user/:id', component: EditUserComponent, canActivate: [authGuard], data: {role: 1}, canDeactivate: [changesGuard]},
  { path: 'changePass', component: ChangePassComponent, canActivate: [authGuard] },
  { path: 'view/:id', component: ViewComponent },
  { path: '', pathMatch: 'full', component: LoginComponent, canActivate: [insideGuard] },
  { path: '**', pathMatch: 'full', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
