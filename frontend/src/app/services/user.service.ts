import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { loginform } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  idUser: number = 0;
  email: string = '';
  token: string = '';
  lim_consult: number = 0;
  role: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  login(formData: any){
    return this.http.post(`${environment.apiBaseUrl}/login`, formData).pipe(
      tap((res: any) =>{
        // Se almacenan los datos del usuario en la clase
        // this.idUser = res.user.idUser;
        // this.email = res.user.email;
        // this.token = res.token;
        // this.lim_consult = res.user.lim_consult;
        // this.role = res.user.role;
        // Se almacena el token en el localStorage del navegador
        localStorage.setItem('token', res.token);

        // Si se marca el boton recordar se guarda el email en el localStorage
        if(formData.remember){
          localStorage.setItem('email', formData.email);
        }
        else{
          localStorage.removeItem('email');
        }
      })
    );
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  getUserData(){
    return {
      idUser: this.idUser,
      email: this.email,
      token: this.token,
      lim_consult: this.lim_consult,
      role: this.role
    }
  }

  validateToken(){
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${environment.apiBaseUrl}/login/token`, {
      headers: {'x-token': token}
    }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
      }),
      map((res: any) => {
        return true;
      }),
      catchError(err => {
        console.warn(err);
        localStorage.removeItem('token');
        return of(false);
      })
    );
  }

  changePassword(id: any, body: any){
    const token = localStorage.getItem('token') || '';

    return this.http.post(`${environment.apiBaseUrl}/users/${id}/newPassword`, body, {
      headers: {'x-token': token}
    });
  }

  // Funciones GET, POST, PUT y DELETE de los usuarios
  getUsers(desde: any){
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${environment.apiBaseUrl}/users`, {
      headers: {'x-token': token},
      params: {'desde': desde}
    });
  }

  getUserSearch(query: any){
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${environment.apiBaseUrl}/users`,{
      headers: {'x-token': token},
      params: {'query': query}
    });
  }

  getUserById(id: any){
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${environment.apiBaseUrl}/users/${id}`, {
      headers: {'x-token': token}
    });
  }

  createUser(userData: any){
    const token = localStorage.getItem('token') || '';

    return this.http.post(`${environment.apiBaseUrl}/users/`, userData, {
      headers: {'x-token': token}
    });
  }

  updateUser(userData: any, id: any){
    const token = localStorage.getItem('token') || '';

    return this.http.put(`${environment.apiBaseUrl}/users/${id}`, userData, {
      headers: {'x-token': token}
    });
  }

  deleteUser(id: any){
    const token = localStorage.getItem('token') || '';

    return this.http.delete(`${environment.apiBaseUrl}/users/${id}`, {
      headers: {'x-token': token}
    });
  }

}
