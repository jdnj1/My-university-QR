import { Component, OnInit, Renderer2 } from '@angular/core';
import { QrService } from 'src/app/services/qr.service';
import { UniversityService } from 'src/app/services/university.service';
import { environment } from '../../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ConsultService } from 'src/app/services/consult.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  // Variable donde se va a almacenar el código QR
  qr: any;

  // Se obtiene el id del QR a partir de la url
  idQr = this.route.snapshot.params['id'];

  // Variables para almacenar la informacion de las llamadas
  consult: any;
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

  activated: boolean = true;


  constructor(
    private qrService: QrService,
    private uniService: UniversityService,
    private consultService: ConsultService,
    private route: ActivatedRoute,
    private renderer: Renderer2
  ){}

  ngOnInit(): void {
    // this.getConsultById();
    //this.getConsults();
    this.getQr();

    // this.container = this.renderer.selectRootElement('#charts', true);
  }

  getQr(){
    this.qrService.getQrbyId(this.idQr).subscribe({
      next: (res: any) => {
        console.log(res)
        this.qr = res.qr;
        console.log(this.qr.activated)
        // Se comprueba si el QR esta activado o desactivado
        if(this.qr.activated === 0){
          this.activated = false;
          return;
        }
        // Si está activado se obtienen sus llamadas
        else{
          this.getConsults();
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    });
  }

  getConsults(){
    // Se obtienen todos las llamadas que tiene el codigo QR (sin paginación)
    this.consultService.getConsults(this.idQr, -1).subscribe({
      next: (res: any) => {
        console.log(res)
        this.consult = res.consult;

        //Iterar por cada llamada
        this.consult.forEach((cons: any, index: any) => {
          // Primero se comprueba si la llamada está desactivada (Comprobar luego lo de si es el dueño)
          if(cons.activated === 1){

            // Se copmprueba que tipo de operacion tiene
            //this.container.appendChild(this.renderer.createElement('div'))
            if(cons.operation > 1){
              // max, min, last

              // Pasamos los filtros a JSON
              cons.filters = JSON.parse(cons.filters);

              this.uniService.getDataOperation(cons.token, '2023-05-19T05:18:38Z', '2023-05-19T07:18:38Z',
                this.op[cons.operation - 2], Object.values(cons.filters)[0], Object.values(cons.filters)[1]).subscribe({
                  next: (res: any) => {
                    console.log(res)

                    const pru = document.getElementById(`chart${index}`);
                      const chart = echarts.init(pru);
                    if(res.columns.length === 0){
                      const option = {
                        title: {
                          text: `No data`,
                          subtext: "No se ha encontrado ningún dato disponible en estas fechas",
                          left: "center",
                          top: "center",
                          textStyle: {
                            fontSize: 30
                          },
                          subtextStyle: {
                            fontSize: 20
                          }
                        }
                      }

                      chart.setOption(option);
                    }
                    else{
                      // Comprobar que tipo de grafica es
                      if(this.type[cons.chart] === 'gauge'){
                        const option = {
                          tooltip: {
                            formatter: `{a} <br/>{b} : {c}`
                          },
                          series: [
                            {
                              name: res.values[0][res.columns.indexOf('description')],
                              type: this.type[cons.chart],
                              progress: {
                                show: true
                              },
                              detail: {
                                valueAnimation: true,
                                formatter: '{value}'
                              },
                              data: [
                                {
                                  value: res.values[0][res.columns.indexOf(this.op[cons.operation - 2])],
                                  name: res.values[0][res.columns.indexOf('metric')]
                                }
                              ]
                            }
                          ]
                        }

                        chart.setOption(option);
                      }
                      // Solo el valor
                      else{
                        const option = {
                          title: {
                            text: `${res.values[0][res.columns.indexOf(this.op[cons.operation - 2])]} ${res.values[0][res.columns.indexOf('metric')]}`,
                            subtext: res.values[0][res.columns.indexOf('description')],
                            left: "center",
                            top: "center",
                            textStyle: {
                              fontSize: 30
                            },
                            subtextStyle: {
                              fontSize: 20
                            }
                          }
                        }

                        chart.setOption(option);
                      }
                    }
                  },
                  error: (err: HttpErrorResponse) => {
                    console.log(err)
                  }
              });
            }
            else{
              // Todos los datos disponibles
              // Se comienza a montar el cuerpo de la petición
              let body = `{"time_start": "${cons.dateFrom}", "time_end": "${cons.dateTo}", "filters":[`;

              // Añadir los filtros
              if(cons.filter !== ''){
                // Pasamos los filtros a JSON
                console.log(cons.filters)
                cons.filters = JSON.parse(cons.filters);
                console.log(cons.filters)
                Object.entries(cons.filters).forEach((key, index) => {
                  //Comprobar si tienen muchos valores una misma clave
                  body += `{"filter": "${key[0]}", "values": ["${key[1]}"]}`;

                  if(index !== Object.entries(cons.filters).length - 1){
                    body += ','
                  }
                });
              }

              body += ']}';
              console.log(body)
              body = JSON.parse(body)
              console.log(body)
              // Se realiza la peticion a smartuniversity con el json creado
              this.uniService.getData(cons.token, body).subscribe({
                next: (res: any) => {
                  console.log(res)
                },
                error: (err: HttpErrorResponse) => {
                  console.log(err)
                }
              });
            }
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    });
  }

  getConsultById(){
    this.consultService.getConsultbyId(1).subscribe({
      next: (res: any) => {
        console.log(res)
        this.consult = res.consult;

        // Pasamos los filtros a JSON
        this.consult.filters = JSON.parse(this.consult.filters);

        this.uniService.getDataOperation(this.consult.token, '2023-05-19T05:18:38Z', '2023-05-19T07:18:38Z',
          'max', Object.values(this.consult.filters)[0], Object.values(this.consult.filters)[1])
          .subscribe({
            next: (res: any) => {
              console.log(res)
              this.petition = res;
            },
            error: (err: HttpErrorResponse) => {
              console.log(err)
            }
          });

      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    });
  }
}
