import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultService } from 'src/app/services/consult.service';
import { QrService } from 'src/app/services/qr.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { PageComponent } from 'src/app/layouts/pagination/page.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UserService } from 'src/app/services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css']
})
export class QrComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchClear') searchClearElement!: ElementRef<HTMLElement>;
  @ViewChild('msg') msgElement!: ElementRef<HTMLElement>;
  @ViewChild('searchField') searchFieldElement!: ElementRef<HTMLElement>;

  @ViewChild(PageComponent) pagination!: PageComponent;

  //Datos del qr
  idQr = this.route.snapshot.params['id'];
  urlQr: string = `${environment.appBaseUrl}/view/${this.idQr}`;
  width = 256;
  qr: any;
  qrUsu: number = 0;

  idUsu: number = 0;
  usuEmail: string = '';

  create: boolean = this.idQr === '0'? true : false;
  formSubmit: boolean = false;

  // Llamadas del QR
  consults: any = [];
  totalCons: number = 0;
  disableConsult: any = [];
  consultForm: any = [];

  activateForm = this.fb.group({
    activated: [false]
  });

  dataQrForm = this.fb.group({
    description: [''],
    tagName: [''],
    tagDescription: [''],
    date: [''],
    sizePrint: [''],
    share: new UntypedFormControl(false)
  });

  // Form de búsqueda de QR
  searchForm = this.fb.group({
    searchQuery: ['']
  });

  lastSearch: any;

  buttons = true;
  timer: any;

  // Variables para comprobar si hay cambios el formulario de configuracion
  qrSubscription: any;
  hasChanges: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private qrService: QrService,
    private consultService: ConsultService,
    private alertService: AlertService,
    private router: Router,
    private translateService: TranslateService,
    private userService: UserService
  ){}

  ngOnInit(): void {
    // Si el id de la ruta es 0 es porque se va a crear un nuevo codigo QR
    if(!this.create){
      this.getData();
    }
    else{
      this.dataQrForm = this.fb.group({
        description: ['', Validators.required],
        tagName: [''],
        tagDescription: [''],
        date: ['', Validators.required],
        sizePrint: ['a4'],
        share: [false]
      });

      // Nos suscribimos a los cambios que pueda tener el fomrmulario
      this.qrSubscription = this.dataQrForm.valueChanges.subscribe( () => {
        this.hasChanges = true;
      });
    }
  }

  ngAfterViewInit(): void {
    if(!this.create){
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
  }

  ngOnDestroy(): void {
    // Liberar recursos
    this.qrSubscription.unsubscribe();

  }

  getData(){
    this.idUsu = this.userService.getId();
    this.getQr();
    this.getConsults(0);
  }

  campoValido(campo: string){
    return this.dataQrForm.get(campo)?.valid || !this.formSubmit;
  }

  getQr(){
    // Obtenemos todos los datos del QR
    this.qrService.getQrbyId(this.idQr).subscribe({
      next: (res: any) => {
        this.qr = res.qr;
        this.qrUsu = res.qr.user;

        this.urlQr = `${environment.appBaseUrl}/view/${this.qr.uid}`;

        //Adaptamos el formato de la fecha para poder ponerla en el input
        let date = new Date(this.qr.date);
        this.qr.date = format(date, "yyyy-MM-dd");

        // Se rellenan los datos del formulario con los datos del QR
        this.dataQrForm.get('description')?.setValue(this.qr.description);

        this.dataQrForm.get('tagName')?.setValue(this.qr.tagName);

        this.dataQrForm.get('tagDescription')?.setValue(this.qr.tagDescription);

        this.dataQrForm.get('date')?.setValue(this.qr.date);

        this.dataQrForm.get('sizePrint')?.setValue(this.qr.sizePrint);

        //Botón compartir
        if(this.qr.share === 1){
          this.dataQrForm.get('share')?.setValue(true);
        }
        else{
          this.dataQrForm.get('share')?.setValue(false);
        }

        // Botón activar
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

        // Nos suscribimos a los cambios que pueda tener el formulario
        this.qrSubscription = this.dataQrForm.valueChanges.subscribe( () => {
          this.hasChanges = true;
        });

        // Obtenemos el email de usuario por si el QR no es del dueño
        this.userService.getUserById(this.qr.user).subscribe({
          next: (res: any) => {
            this.usuEmail = res.user.email;
          },
          error: (err: HttpErrorResponse) => {
            this.alertService.error(this.translateService.instant('alert.user.email.error'));
          }
        })
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error(this.translateService.instant('alert.qr.get'));
      }
    });
  }

  getConsults(page: any, query?: any){
    if(!query) query = '';

    // Obtenemos las llamadas del código QR.
    this.consultService.getConsults(this.idQr, page, query).subscribe({
      next: (res: any) => {
        this.consults = res.consult;
        this.totalCons = res.page.total;

        if(this.consults.length === 0){
          this.msgElement.nativeElement.innerHTML = 'No has creadao ningún código QR todavía.'
          this.msgElement.nativeElement.style.display = 'table-cell';
          return;
        }
        else{
          this.msgElement.nativeElement.style.display = 'none';
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
        this.alertService.error(this.translateService.instant('alert.cons.list'))
      }
    })
  }

  createConsult(){
    this.router.navigateByUrl(`consult/${this.idQr}/0`);
  }


  activateQr(){
    let value;
    let msg: string;

    if(!this.activateForm.value.activated){
      value = {activated: 0};
      msg= this.translateService.instant('alert.qr.deactivated');
    }
    else{
      value = {activated: 1};
      msg= this.translateService.instant('alert.qr.activated');
    }

    //actualizamos el atributo activado de la base de datos.
    this.qrService.updateQr(value, this.qr.idQr).subscribe({
      next: (res:any) =>{
        this.alertService.success(msg);
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error(this.translateService.instant('alert.qr.update.error'));
      }
    })
  }

  updateQr(){
    // Se comprueba el valor del campo share para pasar un 1 o un 0
    if(this.dataQrForm.get('share')?.value){
      this.dataQrForm.get('share')?.setValue(1)
    }
    else{
      this.dataQrForm.get('share')?.setValue(0);
    }

    // Se comprueba si se esta creando un qr
    if(this.create){

      this.formSubmit = true;
      // Se crea el qr si el formulario no tiene errores
      if (!this.dataQrForm.valid) {
        return;
      }

      this.qrService.createQr(this.dataQrForm.value).subscribe({
        next: (res:any) =>{
          this.idQr = res.qr;
          this.urlQr = `${environment.appBaseUrl}/view/${this.idQr}`;
          this.create = false;
          this.hasChanges = false;
          this.qrSubscription.unsubscribe();
          this.getData();
          this.router.navigateByUrl(`codeQr/${this.idQr}`);
          this.alertService.success(this.translateService.instant('alert.qr.create'));
        },
        error: (err: HttpErrorResponse) => {
          this.alertService.error(this.translateService.instant('alert.qr.create.error'));
        }
      });

    }
    else{

      // Se acutaliza el qr con los datos introducidos
      this.qrService.updateQr(this.dataQrForm.value, this.qr.idQr).subscribe({
        next: (res: any) => {
          this.alertService.success(this.translateService.instant('alert.qr.update'));
          this.hasChanges = false;
        },
        error: (err: HttpErrorResponse) => {
          this.alertService.error(this.translateService.instant('alert.qr.update.error'));
        }
      });

    }
  }


  activateConsult(index: any){
    let value;
    let msg: string;

    if(!this.consultForm[index].value.activated){
      this.disableConsult[index] = true;
      value = {activated: 0};
      msg= this.translateService.instant('alert.cons.deactivated');
    }
    else{
      this.disableConsult[index] = false;
      value = {activated: 1};
      msg= this.translateService.instant('alert.cons.activated');
    }

    //actualizamos el atributo activado de la base de datos.
    this.consultService.updateConsult(value, this.consults[index].idConsult).subscribe({
      next: (res:any) =>{
        this.alertService.success(msg);
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error(this.translateService.instant('alert.cons.update.error'));
      }
    });
  }

  deleteConsult(index: any){
     // Se lanza un mensaje modal para que el usuario confirme si quiere la llamada
     Swal.fire({
      icon: 'warning',
      title: this.translateService.instant('qr.modal.delete.title'),
      text: this.translateService.instant('qr.modal.delete.text'),
      showCancelButton: true,
      cancelButtonText: this.translateService.instant('button.cancel'),
      confirmButtonText: this.translateService.instant('button.delete'),
      confirmButtonColor: '#dc3545',
      reverseButtons: true
    }).then((result) => {
      if(result.isConfirmed){
        this.consultService.deleteConsult(this.consults[index].idConsult).subscribe({
          next: (res: any) => {
            this.alertService.success(this.translateService.instant('alert.cons.delete'));

            this.pagination.numPage = 0;

            this.getConsults(0);
          },
          error: (err: HttpErrorResponse) => {
            this.alertService.error(this.translateService.instant('alert.cons.delete.error'));
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

    this.lastSearch = '%' + this.searchForm.value.searchQuery + '%';

    this.getConsults(0, this.lastSearch);
  }

  cleanSearch(){
    this.searchForm.get('searchQuery')?.setValue('');
    this.lastSearch = '';
    this.checkSearch();
  }

  checkSearch(){
    // Cuando esta vacio
    if(this.searchForm.value.searchQuery === ''){
      // Se esconde el boton de limpiar el input
      this.searchClearElement.nativeElement.style.display = 'none';
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
    this.router.navigateByUrl(`/consult/${this.idQr}/${this.consults[index].idConsult}`);
  }

  copyConsult(index: any){
    this.router.navigateByUrl(`/consult/0/${this.consults[index].idConsult}`);
  }

  recieveArray(page: any){
    this.getConsults(page*10, this.lastSearch);

  }

  // Funciones para ordenar las llamadas del Qr
  down(index: any){
    // Se le suma +1 en el orden y al de abajo se le resta para asi intercambiar los puestos

    this.consultService.updateConsult({orderConsult: index + 1}, this.consults[index].idConsult).subscribe({
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.alertService.error(this.translateService.instant('alert.cons.order.error'))
      }
    });

    this.consultService.updateConsult({orderConsult: index}, this.consults[index + 1].idConsult).subscribe({
      next: (res: any) => {
        this.alertService.success((this.translateService.instant('alert.cons.order')));
        // Obtenemos de nuevo la lista de las llamadas
        this.getConsults(0);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.alertService.error(this.translateService.instant('alert.cons.order.error'))
      }
    });

  }

  up(index: any){
    // Se le resta -1 en el orden y al de arriba se le suma para asi intercambiar los puestos

    this.consultService.updateConsult({orderConsult: index - 1}, this.consults[index].idConsult).subscribe({
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.alertService.error(this.translateService.instant('alert.cons.order.error'))
      }
    });

    this.consultService.updateConsult({orderConsult: index}, this.consults[index - 1].idConsult).subscribe({
      next: (res: any) => {
        this.alertService.success(this.translateService.instant('alert.cons.order'));
        // Obtenemos de nuevo la lista de las llamadas
        this.getConsults(0);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.alertService.error(this.translateService.instant('alert.cons.order.error'))
      }
    });
  }

  generatePDF(){

    const data = document.getElementById('qrCode');
    const doc = new jsPDF('p', 'pt', this.qr.sizePrint);

    html2canvas(data!).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      doc.addImage(img, 'PNG', 0, 0, width, height, undefined, 'FAST');
      doc.save(`${this.qr.description}.pdf`);
    })

  }

  cancel(){
    this.router.navigateByUrl(`home`)
  }
}
