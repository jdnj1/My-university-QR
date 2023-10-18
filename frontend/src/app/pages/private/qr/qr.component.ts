import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { ConsultService } from 'src/app/services/consult.service';
import { QrService } from 'src/app/services/qr.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { PageComponent } from 'src/app/layouts/pagination/page.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  urlQr = `${environment.appBaseUrl}/view/${this.idQr}`;
  width = 256;
  qr: any;

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
    sizePrint: ['']
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
  ){}

  ngOnInit(): void {
    this.checkExit();
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
        sizePrint: ['a4']
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

        //Adaptamos el formato de la fecha para poder ponerla en el input
        let date = new Date(this.qr.date);
        this.qr.date = format(date, "yyyy-MM-dd");

        // Se rellenan los datos del formulario con los datos del QR
        this.dataQrForm.get('description')?.setValue(this.qr.description);

        this.dataQrForm.get('tagName')?.setValue(this.qr.tagName);

        this.dataQrForm.get('tagDescription')?.setValue(this.qr.tagDescription);

        this.dataQrForm.get('date')?.setValue(this.qr.date);

        this.dataQrForm.get('sizePrint')?.setValue(this.qr.sizePrint);

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
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error('No se ha podido obtener el código QR');
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
    this.router.navigateByUrl(`consult/${this.idQr}/0`);
    // this.consultService.createConsult({qrCode: this.idQr}).subscribe({
    //   next: (res:any) =>{
    //     console.log(res);
    //     this.alertService.success("Llamada generada correctamente");
    //     this.router.navigateByUrl(`/consult/${res.consult.insertId}`);
    //   },
    //   error: (err: HttpErrorResponse) => {
    //     this.alertService.error('Error al crear la llamada');
    //     console.log(err)
    //   }
    // });
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

  updateQr(){
    // Se comprueba si se esta creando un qr
    if(this.create){
      this.formSubmit = true;
      // Se crea el qr si el formulario no tiene errores
      if (!this.dataQrForm.valid) {
        return;
      }

      this.qrService.createQr(this.dataQrForm.value).subscribe({
        next: (res:any) =>{
          this.idQr = res.qr.insertId;
          this.urlQr = `${environment.appBaseUrl}/view/${this.idQr}`;
          this.create = false;
          this.hasChanges = false;
          this.qrSubscription.unsubscribe();
          this.getData();
          this.router.navigateByUrl(`codeQr/${this.idQr}`);
          this.alertService.success("Código QR generado correctamente");
        },
        error: (err: HttpErrorResponse) => {
          this.alertService.error('Error al crear el código QR');
          console.log(err)
        }
      });
    }
    else{
      // Se acutaliza el qr con los datos introducidos
      this.qrService.updateQr(this.dataQrForm.value, this.qr.idQr).subscribe({
        next: (res: any) => {
          this.alertService.success('QR actualizado correctamente');
          this.hasChanges = false;
        },
        error: (err: HttpErrorResponse) => {
          this.alertService.error('Error al intentar actualizar el QR');
          console.log(err)
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

            this.pagination.numPage = 0;

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

    this.lastSearch = this.searchForm.value.searchQuery;

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
        this.alertService.error('Se ha producido un error al actualizar el orden')
      }
    });

    this.consultService.updateConsult({orderConsult: index}, this.consults[index + 1].idConsult).subscribe({
      next: (res: any) => {
        this.alertService.success("El orden se ha actualizado correctamente");
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.alertService.error('Se ha producido un error al actualizar el orden')
      }
    });

    // Obtenemos de nuevo la lista de las llamadas
    this.getConsults(0);

  }

  up(index: any){
    // Se le resta -1 en el orden y al de arriba se le suma para asi intercambiar los puestos

    this.consultService.updateConsult({orderConsult: index - 1}, this.consults[index].idConsult).subscribe({
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.alertService.error('Se ha producido un error al actualizar el orden')
      }
    });

    this.consultService.updateConsult({orderConsult: index}, this.consults[index - 1].idConsult).subscribe({
      next: (res: any) => {
        this.alertService.success("El orden se ha actualizado correctamente");
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.alertService.error('Se ha producido un error al actualizar el orden')
      }
    });

    // Obtenemos de nuevo la lista de las llamadas
    this.getConsults(0);
  }

  generatePDF(){

    const data = document.getElementById('qrCode');
    const doc = new jsPDF('p', 'pt', this.qr.sizePrint);

    html2canvas(data!).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      const imgProp = doc.getImageProperties(img);
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      console.log(width, doc.internal.pageSize.width, imgProp.width)


      const x = doc.internal.pageSize.width / 2 + imgProp.width / 2;
      const y = doc.internal.pageSize.height / 2 + imgProp.height / 2;

      console.log(x, y)

      doc.addImage(img, 'PNG', 0, 0, width, height, undefined, 'FAST');
      doc.save(`${this.qr.description}.pdf`);
    })

  }

  cancel(){
    this.router.navigateByUrl(`home`)
  }

  checkExit(){
    this.router.events.subscribe((event: any) => {
      if(event instanceof NavigationStart && this.hasChanges){
        Swal.fire({
          icon: "warning",
          title: "¡Cambios sin guardar!",
          text: "¿Desea continuar sin guardar los cambios?",
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Confirmar',
          confirmButtonColor: '#198754',
          reverseButtons: true
        }).then((result) => {
          if(result.isConfirmed){
            this.hasChanges = false;
            this.router.navigateByUrl(event.url);
          }
          else{
            return;
          }
        })
      }
    });
  }
}
