import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QrService } from 'src/app/services/qr.service';
import { AlertService } from 'src/app/utils/alert/alert.service';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css']
})
export class QrComponent implements OnInit {
  //Datos del qr
  urlQr = "ahora lo cambio";
  width = 256;
  qr: any;

  activateForm = this.fb.group({
    activated: [false]
  });

  dataQrForm = this.fb.group({
    description: ['Descripción del QR'],
    tagName: ['Nombre de etiqueta'],
    tagDescription: ['Descripción de etiqueta']
  });

  buttons = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private qrService: QrService,
    private alertService: AlertService,
    private router: Router
  ){}

  ngOnInit(): void {
    // Se almacena el id del código QR
    let id: any = this.route.snapshot.params['id'];

    if(id === "new"){
      // Se crea un nuevo código QR
    }
    else{
      // Obtenemos todos los datos del QR
      this.qrService.getQrbyId(id).subscribe({
        next: (res: any) => {
          console.log(res);
          this.qr = res.qr;

          this.dataQrForm = this.fb.group({
            description: [{value: this.qr.description, disabled: true}],
            tagName: [{value: this.qr.tagName, disabled: true}],
            tagDescription: [{value: this.qr.tagDescription, disabled: true}]
          });

          if(this.qr.activated === 1){
            this.activateForm = this.fb.group({
              activated: [true]
            });
          }
          else{
            this.activateForm = this.fb.group({
              activated: [false]
            });
          }

          console.log(this.dataQrForm)
        },
        error: (err: HttpErrorResponse) => {
          this.alertService.error('No se ha podido obtener el código QR');
        }
      })
    }


  }


  activateQr(){
    let value;
    let msg: string;

    if(!this.activateForm.value.activated){
      value = {activated: 0};
      msg= 'Código QR desactivado correctamente';
    }
    else{
      value = {activated: 1};
      msg= 'Código QR activado correctamente';
    }

    //actualizamos el atributo activado de la base de datos.
    this.qrService.updateQr(value, this.qr.idQr).subscribe({
      next: (res:any) =>{
        this.alertService.success(msg);
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error('Error al acutalizar el código QR');
      }
    })
  }

  startUpdate(){
    this.dataQrForm.get('description')?.enable();
    this.dataQrForm.get('tagName')?.enable();
    this.dataQrForm.get('tagDescription')?.enable();
    this.buttons = true;
  }

  cancelUpdate(){
    this.dataQrForm.get('description')?.disable();
    this.dataQrForm.get('tagName')?.disable();
    this.dataQrForm.get('tagDescription')?.disable();
    this.buttons = false;
  }

  updateQr(){
    // Se acutaliza el qr con los datos introducidos
    this.qrService.updateQr(this.dataQrForm.value, this.qr.idQr).subscribe({
      next: (res: any) => {
        this.alertService.success('QR actualizado correctamente');
        this.cancelUpdate();
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error('Error al intentar actualizar el QR');
        console.log(err)
      }
    })
  }

}
