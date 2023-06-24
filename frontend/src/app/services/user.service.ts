import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { loginform } from '../interfaces/login-form.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  login(formData: any){
    console.log(formData)
    return this.http.post('http://localhost:3000/api/login', formData);
  }

}
