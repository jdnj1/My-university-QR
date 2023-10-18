import { Injectable } from '@angular/core';
import { QrService } from './qr.service';
import { qr } from '../interfaces/qr.interface';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  private listQR: qr[] = [];
  private imgQR: string[] = [];

  constructor(
    private qrService: QrService
  ) { }

  pushCode(qr: qr, img: string){
    this.listQR.push(qr);
    this.imgQR.push(img);
  }

  removeCode(qr: qr, img: string){
    this.listQR = this.listQR.filter(code => code.idQr !== qr.idQr);
    this.imgQR = this.imgQR.filter(imag => imag !== img);
  }

  clean(){
    this.listQR = [];
    this.imgQR = [];
  }

  isCode(qr: qr){
    let list = this.listQR.filter(code => code.idQr === qr.idQr);

    if(list.length !== 0) return true;
    return false;
  }

  listCode(){
    return this.listQR;
  }

  imgCode(){
    return this.imgQR;
  }

  // listDb(qr: qr){
  //   return this.qrService.getQrbyqr(qr);
  // }
}
