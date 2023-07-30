import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {

  constructor(
    private http: HttpClient,
  ) { }

  getData(body: any){
    return this.http.post(`${environment.apiBaseUrl}/smartuni`, body);
  }

  getDataOperation(data: any){
    return this.http.post(`${environment.apiBaseUrl}/smartuni/operation`, data)
  }
}
