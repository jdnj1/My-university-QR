import { HttpErrorResponse } from '@angular/common/http';
import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultService } from 'src/app/services/consult.service';
import { QrService } from 'src/app/services/qr.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css']
})
export class QrComponent implements OnInit, AfterViewInit {
  @ViewChild('searchClear', { static: true }) searchClearElement!: ElementRef<HTMLElement>;
  @ViewChild('msg', { static: true }) msgElement!: ElementRef<HTMLElement>;
  @ViewChild('searchField', { static: true }) searchFieldElement!: ElementRef<HTMLElement>;

  //Datos del qr
  idQr = this.route.snapshot.params['id'];
  urlQr = `${environment.appBaseUrl}/view/${this.idQr}`;
  width = 256;
  qr: any;

  // Llamadas del QR
  consults: any = [];
  disableConsult: any = [];
  consultForm: any = [];

  activateForm = this.fb.group({
    activated: [false]
  });

  dataQrForm = this.fb.group({
    description: ['Descripción del QR'],
    tagName: ['Nombre de etiqueta'],
    tagDescription: ['Descripción de etiqueta'],
    date: ['']
  });

  // Form de búsqueda de QR
  searchForm = this.fb.group({
    searchQuery: ['']
  });

  buttons = true;
  timer: any;

  // Variable que indica cuantas paginas deben haber
  page: number = 0;
  pageArray: Array<number> = [];
  numPage: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private qrService: QrService,
    private consultService: ConsultService,
    private alertService: AlertService,
    private router: Router,
    private renderer: Renderer2
  ){}

  ngOnInit(): void {
    this.getQr();
    this.getConsults(0);
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

  getQr(){
    // Obtenemos todos los datos del QR
    this.qrService.getQrbyId(this.idQr).subscribe({
      next: (res: any) => {
        this.qr = res.qr;

        //Adaptamos el formato de la fecha para poder ponerla en el input
        let date = new Date(this.qr.date);
        this.qr.date = format(date, "yyyy-MM-dd");

        // Se rellenan los datos del formulario con los datos del QR
        this.dataQrForm = this.fb.group({
          description: [this.qr.description],
          tagName: [this.qr.tagName],
          tagDescription: [this.qr.tagDescription],
          date: [this.qr.date]
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
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error('No se ha podido obtener el código QR');
      }
    });
  }

  getConsults(page: any){
    // Obtenemos las llamadas del código QR.
    this.consultService.getConsults(this.idQr, page).subscribe({
      next: (res: any) => {
        this.consults = res.consult;

        if(this.consults.length === 0){
          this.msgElement.nativeElement.innerHTML = 'No has creadao ningún código QR todavía.'
          this.msgElement.nativeElement.style.display = 'table-cell';
          return;
        }

        this.page = Math.ceil(res.page.total / 10);
        console.log(this.page)
        for (let i = 0; i < this.page; i++) {
          this.pageArray.push(i+1);
        }

        for (let i = 0; i < this.consults.length; i++) {
          if(this.consults[i].activated === 1){
            this.consultForm[i] = this.fb.group({
              activated: [true]
            });

            this.disableConsult[i] = false;
          }
          else{
            this.consultForm[i] = this.fb.group({
              activated: [false]
            });

            this.disableConsult[i] = true;
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error("No se ha podido obtener las llamadas obtener las llamadas")
      }
    })
  }

  createConsult(){
    this.consultService.createConsult({qrCode: this.idQr}).subscribe({
      next: (res:any) =>{
        console.log(res);
        this.alertService.success("Llamada generada correctamente");
        this.router.navigateByUrl(`/consult/${res.consult.insertId}`);
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error('Error al crear la llamada');
        console.log(err)
      }
    });
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
    this.dataQrForm.get('date')?.enable();
    this.buttons = true;
  }

  cancelUpdate(reset: boolean){
    this.dataQrForm.get('description')?.disable();
    this.dataQrForm.get('tagName')?.disable();
    this.dataQrForm.get('tagDescription')?.disable();
    this.dataQrForm.get('date')?.disable();
    this.buttons = false;

    if(reset){
      // Se vuelven a poner los datos que tenian antes de acutalizar
      this.dataQrForm.get('description')?.reset(this.qr.description);
      this.dataQrForm.get('tagName')?.reset(this.qr.tagName);
      this.dataQrForm.get('tagDescription')?.reset(this.qr.tagDescription);
      this.dataQrForm.get('date')?.reset(this.qr.date);
    }
  }

  updateQr(){
    // Se acutaliza el qr con los datos introducidos
    this.qrService.updateQr(this.dataQrForm.value, this.qr.idQr).subscribe({
      next: (res: any) => {
        this.alertService.success('QR actualizado correctamente');
        this.cancelUpdate(false);
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error('Error al intentar actualizar el QR');
        console.log(err)
      }
    })
  }


  activateConsult(index: any){
    let value;
    let msg: string;

    if(!this.consultForm[index].value.activated){
      this.disableConsult[index] = true;
      value = {activated: 0};
      msg= 'Llamada desactivada correctamente';
    }
    else{
      this.disableConsult[index] = false;
      value = {activated: 1};
      msg= 'Llamada activada correctamente';
    }

    //actualizamos el atributo activado de la base de datos.
    this.consultService.updateConsult(value, this.consults[index].idConsult).subscribe({
      next: (res:any) =>{
        this.alertService.success(msg);
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error('Error al acutalizar la llamada');
      }
    });
  }

  deleteConsult(index: any){
     // Se lanza un mensaje modal para que el usuario confirme si quiere la llamada
     Swal.fire({
      icon: 'warning',
      title: 'Eliminar llamada',
      text: 'Va a eliminar esta llamada del código QR. Esta acción no se puede revertir.',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#dc3545',
      reverseButtons: true
    }).then((result) => {
      if(result.isConfirmed){
        this.consultService.deleteConsult(this.consults[index].idConsult).subscribe({
          next: (res: any) => {
            this.alertService.success('Llamada eliminada');

            this.getConsults(0);
          },
          error: (err: HttpErrorResponse) => {
            this.alertService.error('Error al eliminar el código QR');
          }
        })
      }
    });
  }

  // Funciones relacionadas con la barra de búsqueda
  search(){
    // Se comprueba que el fomrulario este correcto
    if(!this.searchForm.valid){
      return;
    }

    // Se almacena el id del código QR
    let id: any = this.route.snapshot.params['id'];

    this.consultService.getConsultsSearch(id ,this.searchForm.value.searchQuery).subscribe({
      next: (res: any) =>{
        console.log(res);

        this.consults = res.consult;

        if(this.consults.length === 0){
          this.msgElement.nativeElement.innerHTML = 'No se ha encontrado ninguna llamada.';
          this.msgElement.nativeElement.style.display = 'table-cell';
          return;
        }

        for (let i = 0; i < this.consults.length; i++) {
          if(this.consults[i].activated === 1){
            this.consultForm[i] = this.fb.group({
              activated: [true]
            });

            this.disableConsult[i] = false;
          }
          else{
            this.consultForm[i] = this.fb.group({
              activated: [false]
            });

            this.disableConsult[i] = true;
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.alertService.error('Se ha producido un error al buscar llamadas')
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
      this.getConsults(0);
      this.msgElement.nativeElement.style.display = 'none';
    }
    // Cuando no esta vacio
    else{
      // Se muestra el boton
      this.searchClearElement.nativeElement.style.display = 'inline-block';
    }
  }

  goConsult(index: any){
    this.router.navigateByUrl(`/consult/${this.consults[index].idConsult}`)
  }

  recieveArray(page: any){
    this.getConsults(page*10);

  }

  // Funciones para ordenar las llamadas del Qr
  down(index: any){
    let con = this.consults.splice(index, 1)[0];
    this.consults.splice(index + 1, 0, con);

    // Hacerlo tambien con los array de disable consult y consult form
    let dis = this.disableConsult.splice(index, 1)[0];
    this.disableConsult.splice(index + 1, 0, dis);

    let form = this.consultForm.splice(index, 1)[0];
    this.consultForm.splice(index + 1, 0, form);
  }

  up(){

  }
}
