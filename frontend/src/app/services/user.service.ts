import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { loginform } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  login(formData: any){
    return this.http.post(`${environment.apiBaseUrl}/login`, formData);
  }

  // userIsLoggedIn(){
  //   this.validateToken().pipe(
  //     tap(res => {
  //       console.log(res);
  //       return true;
  //     })
  //   );
  // }

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
        return of(false);
      })
    );
  }

}
