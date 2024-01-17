import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  // 0 => Home, 1 => Qr, 2 => User
  private table: number = 0;

  private posHome: number = 0;
  private posQr: number = 0;
  private posUser: number = 0;

  constructor() { }

  setTable(num: number){
    this.table = num;
  }

  setPos(num: number){
    switch (this.table){
      case 0:
        this.setHome(num);
        break;

      case 1:
        this.setQr(num);
        break;

      case 2:
        this.setUser(num);
        break;
    }
  }

  setHome(num: number){
    this.posHome = num;
  }

  setQr(num: number){
    this.posQr = num;
  }

  setUser(num: number){
    this.posUser = num;
  }

  getPos(){
    switch (this.table){
      case 0:
        return this.getHome();

      case 1:
        return this.getQr();

      case 2:
        return this.getUser();

    }

    return 0;
  }

  getHome(){
    return this.posHome;
  }

  getQr(){
    return this.posQr;
  }

  getUser(){
    return this.posUser;
  }
}
