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

  // Variable donde se va a almacenar el código QR
  qr: string = '';

  // Se obtiene el id del QR a partir de la url
  idQr = this.route.snapshot.params['id'];

  // Variables para almacenar la informacion de las llamadas
  charts: any;
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

    // this.container = this.renderer.selectRootElement('#charts', true);
  }

  ngAfterViewInit(): void {

    this.viewQr();
  }

  viewQr(){
    this.qrService.viewQr(this.idQr).subscribe({
      next: (res: any) => {
        console.log(res);
        this.loading = false;
        this.charts = res.res.charts;
        this.qr = res.res.titleQr;
        console.log(this.charts)

        // Se itera entre las gráficas devueltas
        this.charts.forEach( (chart: any, index: any) => {
          const chartComponent = this.containerRef.createComponent(ChartComponent)
          chartComponent.instance.data = chart;
          chartComponent.instance.id = index;
        });

      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.loading = false;
        this.warning = true;
        console.log(this.loading)

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
