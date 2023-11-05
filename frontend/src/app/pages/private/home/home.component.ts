import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { QrService } from 'src/app/services/qr.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { PageComponent } from 'src/app/layouts/pagination/page.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { he } from 'date-fns/locale';
import { PrintService } from 'src/app/services/print.service';
import { qr } from 'src/app/interfaces/qr.interface';
import { TranslateService } from '@ngx-translate/core';

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

  codesQr: qr[] = [];
  totalQr: number = 0;

  // Qr generados
  urlQr: string[] = [];
  imgQr: string[] = [];
  width = 256;
  lgWidth = 300;

  disabledQr: any = [];
  expiredQr: any = [];

  public activateForm: any = [];

  // Form de búsqueda de QR
  searchForm = this.fb.group({
    searchQuery: ['']
  });

  lastSearch: any;

  timer: any;

  // Booleano para indicar si se estan impriemiendo los qr de la lista seleccionada
  print: Boolean = false;

  constructor(
    private qrService: QrService,
    private alertService: AlertService,
    private userService: UserService,
    private fb: FormBuilder,
    private route: Router,
    private printService: PrintService,
    private translateService: TranslateService
  ){}

  ngOnInit(): void{
    // Obtenemos los datos del usuario
    this.idUser = this.userService.getId();
    this.userService.getUserById(this.idUser).subscribe({
      next: (res: any) => {
        this.user = res.user;
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error(this.translateService.instant('alert.user.error'));
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

  getQr(page: any, query?: any){
    if(!query) query = '';

    this.qrService.getQr(page, query).subscribe({
      next: (res: any) => {
        this.codesQr = res.qr;

        this.totalQr = res.page.total;

        if(this.codesQr.length === 0){
          this.msgElement.nativeElement.innerHTML = 'No has creadao ningún código QR todavía.';
          this.msgElement.nativeElement.style.display = 'table-cell';
          return;
        }

        // Cambiamos como se ve la fecha en el frontend
        this.codesQr.forEach((qr: qr, index: number) => {
          let date = new Date(qr.date);
          qr.date = date.toLocaleDateString();

          // Se comprueba si la fecha de validez ha caducado
          if(date < new Date()){
            this.expiredQr.push(true)
          }
          else{
            this.expiredQr.push(false)
          }

          // Almacenamos la url de cada código QR
          this.urlQr[index] = `${environment.appBaseUrl}/view/${qr.idQr}`;
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
        this.alertService.error(this.translateService.instant('alert.qr.list.error'));
      }
    });
  }

  createQr(){
    // Comprobar si no se supera el limite
    if(this.user.lim_consult > this.totalQr || this.user.lim_consult === 0){
      this.route.navigateByUrl('codeQr/0');
    }
    else{
      this.alertService.error(this.translateService.instant('alert.user.limit'));
    }

  }

  editQr(index: number){
    this.route.navigateByUrl(`codeQr/${this.codesQr[index].idQr}`)
  }

  activateQr(index: number){
    let value;
    let msg: string;

    if(!this.activateForm[index].value.activated){
      this.disabledQr[index] = true;
      value = {activated: 0};
      msg= this.translateService.instant('alert.qr.deactivated');
    }
    else{
      this.disabledQr[index] = false;
      value = {activated: 1};
      msg= this.translateService.instant('alert.qr.activated');
    }

    //actualizamos el atributo activado de la base de datos.
    this.qrService.updateQr(value, this.codesQr[index].idQr).subscribe({
      next: (res:any) =>{
        this.alertService.success(msg);
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error(this.translateService.instant('alert.qr.update.error'));
      }
    })
  }

  deleteQr(index: number){
    // Se lanza un mensaje modal para que el usuario confirme si quiere borrar el codigo QR
    Swal.fire({
      icon: 'warning',
      title: this.translateService.instant('home.modal.delete.title'),
      text: this.translateService.instant('home.modal.delete.text'),
      showCancelButton: true,
      cancelButtonText: this.translateService.instant('button.cancel'),
      confirmButtonText: this.translateService.instant('button.delete'),
      confirmButtonColor: '#dc3545',
      reverseButtons: true
    }).then((result) => {
      if(result.isConfirmed){
        this.qrService.deleteQr(this.codesQr[index].idQr).subscribe({
          next: (res: any) => {
            this.alertService.success(this.translateService.instant('alert.qr.delete.success'));

            this.pagination.numPage = 0;

            this.getQr(0);

          },
          error: (err: HttpErrorResponse) => {
            this.alertService.error(this.translateService.instant('alert.qr.delete.error'));
          }
        })
      }
    });
  }

  // Función para guardar las url de los qr generados para usarlos en el mensaje modal
  saveURL(event: any, index: number){
    this.imgQr[index] = event.changingThisBreaksApplicationSecurity;
  }

  // Funcion para que se pueda ver el QR más grande cuando se pone el raton encima
  onMouseQrEnter(index: any){
    Swal.fire({
      title: this.translateService.instant('home.qrmodal.title'),
      imageUrl: this.imgQr[index],
      imageAlt: this.translateService.instant('home.qrmodal.imageAlt'),
      confirmButtonColor: 'green',
      confirmButtonText: this.translateService.instant('home.qrmodal.button'),
      footer: `<a href="${this.urlQr[index]}" target="_blank">${this.translateService.instant('home.qrmodal.link')}</a>`
    }).then((result) => {
      if(result.isConfirmed){
       navigator.clipboard.writeText(this.urlQr[index]);
       this.alertService.success(this.translateService.instant('home.qrmodal.link'));
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
    this.getQr(0, this.lastSearch);
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
      this.getQr(0);
      this.msgElement.nativeElement.style.display = 'none';
    }
    // Cuando no esta vacio
    else{
      // Se muestra el boton
      this.searchClearElement.nativeElement.style.display = 'inline-block';
    }
  }


  recieveArray(page: any){
    this.getQr(page*10, this.lastSearch);

  }



  generatePDF(index: number){

    const qr = document.getElementById('print');

    const doc = new jsPDF('p', 'pt', this.codesQr[index].sizePrint);


    html2canvas(qr!).then((canvas) => {
      qr?.remove();
      const img = canvas.toDataURL('image/PNG');


      const imgProp = doc.getImageProperties(img);

      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      console.log(width, height)
      console.log(imgProp.width, imgProp.height)


      doc.addImage(img, 'PNG', 0, 0, width, height, undefined, 'FAST');
      doc.save(`${this.codesQr[index].description}.pdf`);

    });

  }

  generateQR(index: number){
    Swal.fire({
      title: this.translateService.instant('home.tooltip.download'),
      html: `<div id="print"><p class="text-center fw-bold m-0">${this.codesQr[index].tagName}</p>` +
      `<div id="contqr" class="d-flex align-items-center justify-content-center">` +
        `<img id="imgqr" src="${this.imgQr[index]}" style="width: 256px;">` +
      `</div>` +
      `<p class="text-center small m-0">${this.codesQr[index].tagDescription}</p>` +
    `</div>`,
      footer: `${this.translateService.instant('print.size')} ${this.codesQr[index].sizePrint.toUpperCase()}`,
      showConfirmButton: true,
      confirmButtonText: this.translateService.instant('button.pdf'),
      confirmButtonColor: 'green',
      showCancelButton: true,
      cancelButtonColor: '#dc3545',
      cancelButtonText: this.translateService.instant('button.cancel'),
      reverseButtons: true
    }).then((result) => {
      if(result.isConfirmed){
        document.body.appendChild(Swal.getHtmlContainer() as Node)
        const print = document.getElementById('print');
        print!.style.clipPath = 'circle(0px)';
        print!.style.width = '300px'

        this.generatePDF(index);
      }
    });
  }

  addList(index: number){
    this.printService.pushCode(this.codesQr[index], this.imgQr[index]);
  }

  removeList(index: number){
    this.printService.removeCode(this.codesQr[index], this.imgQr[index]);
  }

  isCode(index: number){
    return this.printService.isCode(this.codesQr[index]);
  }

  listCode(){
    return this.printService.listCode();
  }

  listImg(){
    return this.printService.imgCode();
  }

  async printList(){
    this.print = true
    const doc = new jsPDF('p', 'pt', 'a4');
    let list = this.listCode();
    let listImg = this.listImg();

    for(let i = 0; i < list.length; i++){
      let codeQR = list[i];
      let imgQR = listImg[i];

      let div = this.codes(codeQR, imgQR);

      document.body.append(div);

      await html2canvas(div).then((canvas) => {
        div.remove();
        const img = canvas.toDataURL('image/PNG');


        const imgProp = doc.getImageProperties(img);

        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();

        console.log((width-2*28)/2, height)
        console.log(imgProp.width, imgProp.height)

        // Se calcula el tamaño de las img para que quepan 4 en un a4 con un margen de 10mm =~ 28pt
        const margin = 28;

        const imgWidth = (width - 2 * margin) / 2;
        const imgHeight = (height - 2 * margin) / 2;

        // Se obtiene la posicion x/y que de cada img teniendo en cuenta el margen
        const index =  i % 4;

        const col = index % 2;
        const row = Math.floor(index / 2);

        const x = margin + col * imgWidth;
        const y = margin + row * imgHeight;

        if(i % 4 === 0 && i !== 0){
          doc.addPage();
        }


        //console.log(imgProp.width * index, imgProp.height * index)
        doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight, undefined, 'FAST');
        //w269 h392

      });

    }
    this.print = false;
    //window.open(doc.output('bloburl'));
    doc.save(`varios.pdf`);
  }

  codes(qr: any, im: string){
    const divf = document.createElement('div');
    divf.id = 'print';

    const tag = document.createElement('p');
    tag.classList.add("text-center", "fw-bold", "m-0");
    const tagText = document.createTextNode(qr.tagName);
    tag.appendChild(tagText);

    divf.appendChild(tag);

    const divs = document.createElement('div');
    divs.classList.add("d-flex", "align-items-cente", "justify-content-center");

    const img = document.createElement('img');
    img.setAttribute('src', im);
    //img.style.width = '256px';


    divs.appendChild(img);
    divf.appendChild(divs);

    const tagDes = document.createElement('p');
    tagDes.classList.add("text-center", "small", "m-0");
    const tagDesText = document.createTextNode(qr.tagDescription)
    tagDes.appendChild(tagDesText);

    divf.appendChild(tagDes);

    divf.style.clipPath = 'circle(0px)';
    divf.style.width = '269pt';
    divf.style.height = '392pt';

    return divf;
  }

}
