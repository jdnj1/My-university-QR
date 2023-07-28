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

  getData(token: any, body: any){
    return this.http.post(`${environment.apiBaseUrl}/smartuni`, body, {
      params: {'token' : token}
    });
  }

  getDataOperation(token: any, ts: any, te: any, operation: any, uid: any, name: any){
    return this.http.get(`${environment.apiBaseUrl}/smartuni`, {
      params: {
        'token': token,
        'dateFrom': ts,
        'dateTo': te,
        'operation': operation,
        'uid': uid,
        'name': name
      }
    })
  }
}
