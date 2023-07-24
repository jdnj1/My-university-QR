import { Component, OnInit } from '@angular/core';
import { QrService } from 'src/app/services/qr.service';
import { UniversityService } from 'src/app/services/university.service';
import { environment } from '../../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ConsultService } from 'src/app/services/consult.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  // Variable donde se va a almacenar el código QR
  qr: any;

  // Se obtiene el id del QR a partir de la url
  idQr = this.route.snapshot.params['id'];

  // Variables para almacenar la informacion de las llamadas
  consult: any;

  constructor(
    private qrService: QrService,
    private uniService: UniversityService,
    private consultService: ConsultService,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.getConsultById();
  }

  getQr(){
    this.qrService.getQrbyId(this.idQr).subscribe({
      next: (res: any) => {
        console.log(res)
        this.qr = res.qr;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    });
  }

  getConsults(){
    this.consultService.getConsults(this.idQr, 0);
  }

  getConsultById(){
    this.consultService.getConsultbyId(1).subscribe({
      next: (res: any) => {
        console.log(res)
        this.consult = res.consult;

        // Pasamos los filtros a JSON
        this.consult.filters = JSON.parse(this.consult.filters);

        this.uniService.getDataOperation(this.consult.token, '2023-05-19T05:18:38Z', '2023-05-19T07:18:38Z',
          'max', Object.values(this.consult.filters)[0], Object.values(this.consult.filters)[1])
          .subscribe({
            next: (res: any) => {
              console.log(res)
            },
            error: (err: HttpErrorResponse) => {
              console.log(err)
            }
          });

      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    });
  }
}
