import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { QrService } from 'src/app/services/qr.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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

  // Form de búsqueda de QR
  searchForm = this.fb.group({
    searchQuery: ['']
  });

  timer: any;

  constructor(
    private qrService: QrService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private route: Router,
    private renderer: Renderer2
  ){}

  ngOnInit(): void{
    this.getQr();

    this.renderer.selectRootElement( '#searchClear' ).style.display = 'none';


    // Eventos para hacer que la busqueda se haga al pasar un tiempo solo y no hacer una peticion cada vez que se intriduce una letra
    const searchFieldElement = this.renderer.selectRootElement( '#searchField' );

    searchFieldElement.addEventListener('keyup', () =>{
      clearTimeout(this.timer);
      this.timer = setTimeout(() =>{
        this.search();
      }, 1000)
    });

    searchFieldElement.addEventListener('keydown', () =>{
      clearTimeout(this.timer);
    });
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

  createQr(){
    this.qrService.createQr().subscribe({
      next: (res:any) =>{
        console.log(res);
        this.alertService.success("Código QR generado correctamente");
        this.route.navigateByUrl(`/codeQr/${res.qr.insertId}`);
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error('Error al crear el código QR');
        console.log(err)
      }
    });
  }

  editQr(index: any){
    this.route.navigateByUrl(`codeQr/${this.codesQr[index].idQr}`)
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

  // Funciones relacionadas con la barra de búsqueda
  search(){
    // Se comprueba que el fomrulario este correcto
    if(!this.searchForm.valid){
      return;
    }

    // Se envia al componente de resultado de busqueda
    //this.route.navigateByUrl(`/home/search/${this.searchForm.value.searchQuery}`);

    this.qrService.getQrSearch(this.searchForm.value.searchQuery).subscribe({
      next: (res: any) =>{
        console.log(res);

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
        console.log(err);
      }
    });
  }

  cleanSearch(){
    this.searchForm.get('searchQuery')?.setValue('');
    this.checkSearch();
  }

  checkSearch(){
    const searchClearElement = this.renderer.selectRootElement( '#searchClear' );

    // Cuando esta vacio
    if(this.searchForm.value.searchQuery === ''){
      // Se esconde el boton de limpiar el input
      searchClearElement.style.display = 'none';
      this.getQr();
    }
    // Cuando no esta vacio
    else{
      // Se muestra el boton
      searchClearElement.style.display = 'inline-block';
    }
  }
}
