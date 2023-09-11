import { Component, OnInit, Renderer2 } from '@angular/core';
import { QrService } from 'src/app/services/qr.service';
import { UniversityService } from 'src/app/services/university.service';
import { environment } from '../../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ConsultService } from 'src/app/services/consult.service';
import * as echarts from 'echarts';
import { JsonPipe } from '@angular/common';

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

              let data = {
                token: cons.token,
                dateFrom: '2023-05-19T05:18:38Z', //cambiar por cons.dateFrom
                dateTo: '2023-05-19T07:18:38Z',
                operation: this.op[cons.operation - 2],
                uid: Object.values(cons.filters)[0],
                name: Object.values(cons.filters)[1]
              }

              this.uniService.getDataOperation(data).subscribe({
                next: (res: any) => {
                  console.log(res)
                  let data = res.result;

                  const div = document.getElementById(`chart${index}`);
                  const chart = echarts.init(div);

                  // Función para que se adapte el tamaño e a grafica si se cambia el tamaño de la pantalla
                  window.addEventListener('resize', function() {
                    chart.resize();
                  })

                  if(data.columns.length === 0){
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
                        title: {
                          text: cons.name
                        },
                        series: [
                          {
                            name: data.values[0][data.columns.indexOf('description')],
                            type: this.type[cons.chart],
                            progress: {
                              show: true
                            },
                            detail: {
                              valueAnimation: true,
                              fontSize: 20,
                              formatter: '{value}'
                            },
                            axisLabel: {
                              fontSize: 10
                            },
                            data: [
                              {
                                value: data.values[0][data.columns.indexOf(this.op[cons.operation - 2])],
                                name: data.values[0][data.columns.indexOf('metric')]
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
                          text: `${data.values[0][data.columns.indexOf(this.op[cons.operation - 2])]} ${data.values[0][data.columns.indexOf('metric')]}`,
                          subtext: `${cons.name}: \n\n ${data.values[0][data.columns.indexOf('description')]}`,
                          left: "center",
                          top: "center",
                          width: 2,
                          textStyle: {
                            fontSize: 30
                          },
                        },
                        media: [{
                          query: {
                            maxWidth: 360,
                          },
                          option: {
                            title: {
                              subtextStyle: {
                                fontSize: 10
                              }
                            }
                          }
                        },
                        {
                          query: {
                            minWidth: 361,
                          },
                          option: {
                            title: {
                              subtextStyle: {
                                fontSize: 15
                              }
                            }
                          }
                        }
                      ]
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
              let body: any = `{"token": "${cons.token}", "time_start": "${cons.dateFrom}", "time_end": "${cons.dateTo}", "filters":[`;

              // Añadir los filtros
              if(cons.filter !== ''){
                // Pasamos los filtros a JSON
                cons.filters = JSON.parse(cons.filters);

                Object.entries(cons.filters).forEach((key: any, index) => {
                  // Comprobar si tienen muchos valores una misma clave
                  key[1] = key[1].split(',');

                  body += `{"filter": "${key[0]}", "values": [`;
                  key[1].forEach((elem: any, index: any) => {
                    body += `"${elem}"`;

                    if(index !== key[1].length - 1){
                      body += ','
                    }
                  });

                  body += `]}`;

                  if(index !== Object.entries(cons.filters).length - 1){
                    body += ','
                  }
                });
              }

              body += ']}';
              body = JSON.parse(body)

              // Se realiza la peticion a smartuniversity con el json creado
              this.uniService.getData(body).subscribe({
                next: (res: any) => {
                  console.log(res)
                  let data = res.result;

                  // Montar el objeto de las series

                  // Primero se obtienen los uid presentes en los filtros
                  let ids: any;

                  body.filters.map((id: any) => {
                    if(Object.values(id)[0] === 'uid'){
                      ids = Object.values(id)[1]
                    }
                  })

                  let seriesData: any = [];
                  ids.forEach((id: any) => {
                    // Se filtran los arrays por cada uid y se obtienen sus valores
                    let series = data.values.filter((array: any) => array[data.columns.indexOf('uid')] === id)
                      .map((array: any) => array[data.columns.indexOf('value')]);

                    seriesData.push({
                      name: id,
                      data: series,
                      type: this.type[cons.chart]
                    })
                  });

                  let dates = data.values.map((subarray: any) => subarray[data.columns.indexOf('time')]);

                  const div = document.getElementById(`chart${index}`);
                  const chart = echarts.init(div);

                  // Función para que se adapte el tamaño e a grafica si se cambia el tamaño de la pantalla
                  window.addEventListener('resize', function() {
                    chart.resize();
                  });

                  const option = {
                    title: {
                      text: cons.name,
                      // textStyle: {
                      //   ellipsis: true
                      // },
                    },
                    tooltip: {
                      trigger: 'axis'
                    },
                    legend: {
                      data: ids,
                      top: '10%'
                    },
                    xAxis: {
                      type: 'category',
                      data: dates
                    },
                    yAxis: {
                      type: 'value'
                    },
                    grid: {
                      top: '20%', // Espacio en la parte superior de a grafica
                    },
                    dataZoom: [
                      {
                        type: 'inside',
                        start: 0,
                        end: 10
                      },
                      {
                        start: 0,
                        end: 10
                      }
                    ],
                    series: seriesData
                  };

                  chart.setOption(option);

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

  // getConsultById(){
  //   this.consultService.getConsultbyId(1).subscribe({
  //     next: (res: any) => {
  //       console.log(res)
  //       this.consult = res.consult;

  //       // Pasamos los filtros a JSON
  //       this.consult.filters = JSON.parse(this.consult.filters);

  //       this.uniService.getDataOperation(this.consult.token, '2023-05-19T05:18:38Z', '2023-05-19T07:18:38Z',
  //         'max', Object.values(this.consult.filters)[0], Object.values(this.consult.filters)[1])
  //         .subscribe({
  //           next: (res: any) => {
  //             console.log(res)
  //             this.petition = res;
  //           },
  //           error: (err: HttpErrorResponse) => {
  //             console.log(err)
  //           }
  //         });

  //     },
  //     error: (err: HttpErrorResponse) => {
  //       console.log(err)
  //     }
  //   });
  // }
}