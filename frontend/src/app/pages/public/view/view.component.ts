import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewContainerRef, createComponent } from '@angular/core';
import { QrService } from 'src/app/services/qr.service';
import { UniversityService } from 'src/app/services/university.service';
import { environment } from '../../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ConsultService } from 'src/app/services/consult.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { ChartComponent } from '../chart/chart.component';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit,AfterViewInit {

  @ViewChild('container') containerElement!: ElementRef<HTMLElement>;
  @ViewChild('container', {read: ViewContainerRef}) containerRef!: ViewContainerRef;
  @ViewChild('containerDiv', {read: ViewContainerRef, static: false}) divRef!: ElementRef<HTMLElement>;

  // Variable donde se va a almacenar el titulo del código QR
  qr: string = '';

  // Si el boton de compartir está activo o no
  showShare: number = 0;

  // Se obtiene el id del QR a partir de la url
  idQr = this.route.snapshot.params['id'];

  // Variables para almacenar la informacion de las llamadas
  charts: any = [];
  petition: any = '';

  // Variable con el tipo de operaciones
  op: Array<string> = [
    "max",
    "min",
    "last"
  ];

  // Variable con el tipo de graficas
  type: Array<string> = [
    "line",
    "bar",
    "gauge",
    "number"
  ]

  loading: boolean = true;
  warning: boolean = false;
  message: string = '';


  constructor(
    private qrService: QrService,
    private route: ActivatedRoute,
  ){}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

    this.viewQr();
  }

  viewQr(){
    let data: any = [];

    this.qrService.viewQr(this.idQr).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.charts = res.res.charts;
        this.qr = res.res.titleQr;
        this.showShare = res.res.share;

        // Se itera entre las gráficas devueltas
        for(let i = 0; i < this.charts.length; i++){
          let index = i;
          if(
            this.charts[i] !== undefined &&
            (this.charts[i].type === 2 || this.charts[i].type === 3)
            ){
            this.charts[i].columns = true;
            if(
              this.charts[i + 1] !== undefined &&
              (this.charts[i + 1].type === 2 || this.charts[i + 1].type === 3)
              ){
              this.charts[i + 1].columns = true;
              if(
                this.charts[i + 2] !== undefined &&
                (this.charts[i + 2].type === 2 || this.charts[i + 2].type === 3)
                ){
                this.charts[i + 2].columns = true;
                data.push(this.charts[i], this.charts[i + 1], this.charts[i + 2])
                i += 2;
              }
              else{
                data.push(this.charts[i], this.charts[i + 1])
                i += 1;
              }
            }
            else{
              data.push(this.charts[i]);
            }
          }
          else{
            this.charts[i].columns = false;
            data.push(this.charts[i]);
          }

          const chartComponent = this.containerRef.createComponent(ChartComponent)
          chartComponent.instance.data = data;
          chartComponent.instance.id = index;

          data = [];
        }

      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.warning = true;

        if(err.error.titleQr){
          this.qr = err.error.titleQr;
        }

        if(err.error.msg === 'desactivado'){
          this.message = environment.messNoActive;
        }
        else if(err.error.msg === 'No se ha encontrado el código Qr'){
          this.message = environment.messNoExists;
        }
        else if(err.error.msg === 'caducado'){
          this.message = environment.messExpired;
        }
        else if(err.error.msg === 'El qr no tiene llamadas'){
          this.message = environment.messEmpty;
        }
        else if(err.error.msg === 'desactivadas'){
          this.message = environment.mess0Active;
        }
      }
    })
  }

  // Funcion que permite compartir las gráficas
  share(){
    const shareData = {
      title: "Visualizador gráfico accesible para Smart University",
      text: this.qr,
      url: `${environment.appBaseUrl}/view/${this.idQr}`
    }


    navigator.share(shareData)
      .then(() => console.log("Compartido"))
      .catch(error => console.log(`Error al compartir: ${error}`))


  }
}
