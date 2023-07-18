import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {

  constructor(
    private http: HttpClient,
  ) { }

  getData(){}

  getDataOperation(){}
}
