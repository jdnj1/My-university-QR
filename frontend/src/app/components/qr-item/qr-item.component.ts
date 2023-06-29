import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { QrService } from 'src/app/services/qr.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-qr-item',
  templateUrl: './qr-item.component.html',
  styleUrls: ['./qr-item.component.css']
})
export class QrItemComponent implements OnInit {
  @Input() qr: any;

  disabled = false;

  public activateForm: any;

  constructor(
    private fb: FormBuilder,
    private qrService: QrService,
    private alertService: AlertService
  ){

    // this.activateForm = this.fb.group({
    //   activated: [this.qr.activated]
    // });
  }

  ngOnInit(): void{
    if(this.qr.activated === 1){
      this.activateForm = this.fb.group({
        activated: [true]
      });

      this.disabled = false;
    }
    else{
      this.activateForm = this.fb.group({
        activated: [false]
      });

      this.disabled = true;
    }

  }

  activateQr(formData: any){
    let value;

    if(!formData.value.activated){
      this.disabled = true;
      value = {activated: 0};
    }
    else{
      this.disabled = false;
      value = {activated: 1};
    }

    //actualizamos el atributo activado de la base de datos.
    this.qrService.updateQr(value, this.qr.idQr).subscribe({
      error: (err: HttpErrorResponse) => {
        this.alertService.error('Error al acutalizar el código QR');
      }
    })
  }

  deleteQr(){
    // Se lanza un mensaje modal para que el usuario confirme si quiere borrar el codigo QR
    Swal.fire({
      icon: 'warning',
      title: 'Eliminar código QR',
      text: 'Va a eliminar este código QR. Esta acción no se puede recertir.',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#dc3545',
      reverseButtons: true
    }).then((result) => {
      if(result.isConfirmed){
        this.qrService.deleteQr(this.qr.idQr).subscribe({
          next: (res: any) => {
            this.alertService.success('Código QR eliminado');
          },
          error: (err: HttpErrorResponse) => {
            this.alertService.error('Error al eliminar el código QR');
          }
        })
      }
    });
  }

}
