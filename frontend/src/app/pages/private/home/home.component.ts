import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { QrService } from 'src/app/services/qr.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';
import { PageComponent } from 'src/app/layouts/pagination/page/page.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('searchClear', { static: true }) searchClearElement!: ElementRef<HTMLElement>;
  @ViewChild('msg', { static: true }) msgElement!: ElementRef<HTMLElement>;
  @ViewChild('searchField', { static: true }) searchFieldElement!: ElementRef<HTMLElement>;

  @ViewChild(PageComponent) pagination!: PageComponent;

  // Datos del usuario
  idUser: number = 0;
  user: any;

  codesQr: any = [];
  totalQr: number = 0;

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

  // Variable que indica cuantas paginas deben haber
  page: number = 0;
  pageArray: Array<number> = [];
  numPage: number = 0;

  constructor(
    private qrService: QrService,
    private alertService: AlertService,
    private userService: UserService,
    private fb: FormBuilder,
    private route: Router,
    private renderer: Renderer2
  ){}

  ngOnInit(): void{
    // Obtenemos los datos del usuario
    const token = localStorage.getItem('token') || '';
    const decoded: any = jwt_decode(token);
    this.idUser = decoded.uid;
    this.userService.getUserById(this.idUser).subscribe({
      next: (res: any) => {
        this.user = res.user;
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error('Error al intentar obtener los datos del usuario');
      }
    });

    //Obtenemos los códigos QR
    this.getQr(0);
  }

  ngAfterViewInit(): void {
    this.searchClearElement.nativeElement.style.display = 'none';
    this.msgElement.nativeElement.style.display = 'none';

    // Eventos para hacer que la busqueda se haga al pasar un tiempo solo y no hacer una peticion cada vez que se intriduce una letra
    this.searchFieldElement.nativeElement.addEventListener('keyup', () =>{
      clearTimeout(this.timer);
      this.timer = setTimeout(() =>{
        this.search();
      }, 1000)
    });

    this.searchFieldElement.nativeElement.addEventListener('keydown', () =>{
      clearTimeout(this.timer);
    });
  }

  getQr(page: any){
    this.qrService.getQr(page).subscribe({
      next: (res: any) => {
        this.codesQr = res.qr;
        console.log(this.codesQr.length)
        this.totalQr = res.page.total;

        if(this.codesQr.length === 0){
          this.msgElement.nativeElement.innerHTML = 'No has creadao ningún código QR todavía.';
          this.msgElement.nativeElement.style.display = 'table-cell';
          return;
        }

        this.page = Math.ceil(this.totalQr / 10);

        for (let i = 0; i < this.page; i++) {
          this.pageArray.push(i+1);
        }

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
    // Comprobar si no se supera el limite
    console.log(this.user.lim_consult, this.totalQr)

    if(this.user.lim_consult > this.totalQr || this.user.lim_consult === 0){
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
    else{
      this.alertService.error('Ha superado el límite de codigos QR que se pueden crear en esta cuenta');
    }

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

        if(this.codesQr.length === 0){
          this.msgElement.nativeElement.innerHTML = 'No se han encontrado códigos QR.';
          this.msgElement.nativeElement.style.display = 'table-cell';
          return;
        }

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
    // Cuando esta vacio
    if(this.searchForm.value.searchQuery === ''){
      // Se esconde el boton de limpiar el input
      this.searchClearElement.nativeElement.style.display = 'none';
      this.pageArray.splice(0);
      this.getQr(0);
      this.msgElement.nativeElement.style.display = 'none';
    }
    // Cuando no esta vacio
    else{
      // Se muestra el boton
      this.searchClearElement.nativeElement.style.display = 'inline-block';
    }
  }

  // pageQr(page: any){
  //   if(page !== this.numPage){
  //     this.pageArray.splice(0);

  //     if(page > this.numPage) this.numPage ++;
  //     else this.numPage --;

  //     this.getQr(page*10)
  //   }
  // }

  recieveArray(page: any){
    this.getQr(page*10);

  }
}
