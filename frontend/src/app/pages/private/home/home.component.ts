import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { QrService } from 'src/app/services/qr.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  codesQr: any = [];

  // Qr generados
  urlQr: any = [];
  imgQr: any = [];
  width = 60;
  lgWidth = 300;

  disabledQr: any = [];

  public activateForm: any = [];

  constructor(
    private qrService: QrService,
    private alertService: AlertService,
    private fb: FormBuilder,
  ){}

  ngOnInit(): void{
    this.getQr();
  }

  getQr(){
    this.qrService.getQr().subscribe({
      next: (res: any) => {
        this.codesQr = res.qr;
        // Cambiamos como se ve la fecha en el frontend
        this.codesQr.forEach((qr: any) => {
          let date = new Date(qr.date);
          qr.date = date.toLocaleDateString();

          // Almacenamos la url de cada código QR
          this.urlQr.push(`${environment.appBaseUrl}/view/${qr.idQr}`);
        });

        for (let i = 0; i < this.codesQr.length; i++) {
          if(this.codesQr[i].activated === 1){
            this.activateForm[i] = this.fb.group({
              activated: [true]
            });

            this.disabledQr[i] = false;
          }
          else{
            this.activateForm[i] = this.fb.group({
              activated: [false]
            });

            this.disabledQr[i] = true;
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error('No se ha podido obtener el listado de códigos QR');
      }
    });
  }

  activateQr(index: any){
    let value;
    let msg: string;

    if(!this.activateForm[index].value.activated){
      this.disabledQr[index] = true;
      value = {activated: 0};
      msg= 'Código QR desactivado correctamente';
    }
    else{
      this.disabledQr[index] = false;
      value = {activated: 1};
      msg= 'Código QR activado correctamente';
    }

    //actualizamos el atributo activado de la base de datos.
    this.qrService.updateQr(value, this.codesQr[index].idQr).subscribe({
      next: (res:any) =>{
        this.alertService.success(msg);
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error('Error al acutalizar el código QR');
      }
    })
  }

  deleteQr(index: any){
    // Se lanza un mensaje modal para que el usuario confirme si quiere borrar el codigo QR
    Swal.fire({
      icon: 'warning',
      title: 'Eliminar código QR',
      text: 'Va a eliminar este código QR. Esta acción no se puede revertir.',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#dc3545',
      reverseButtons: true
    }).then((result) => {
      if(result.isConfirmed){
        this.qrService.deleteQr(this.codesQr[index].idQr).subscribe({
          next: (res: any) => {
            this.alertService.success('Código QR eliminado');

            // Se elimina el codigo del array
            this.codesQr.splice(index, 1);
          },
          error: (err: HttpErrorResponse) => {
            this.alertService.error('Error al eliminar el código QR');
          }
        })
      }
    });
  }

  // Función para guardar las url de los qr generados para usarlos en el mensaje modal
  saveURL(event: any, index: any){
    this.imgQr[index] = event.changingThisBreaksApplicationSecurity;

  }

  // Funcion para que se pueda ver el QR más grande cuando se pone el raton encima
  onMouseQrEnter(index: any){
    Swal.fire({
      title: 'Código QR',
      imageUrl: this.imgQr[index],
      imageWidth: 300,
      imageHeight: 300,
      imageAlt: 'Imágen del código QR',
      showConfirmButton: false,
    })
  }
}
