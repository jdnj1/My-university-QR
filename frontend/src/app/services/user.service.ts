import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { loginform } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  login(formData: any){
    console.log(formData)
    return this.http.post(`${environment.apiBaseUrl}/login`, formData);
  }

  userIsLoggedIn(){
    let status = false;

    if ((localStorage.getItem('isLoggedIn') && localStorage.getItem('isLoggedIn') === 'true')) {
      status = true;
    }
    else {

      status = false;
    }
    return status;
  }

}
