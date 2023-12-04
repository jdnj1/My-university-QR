import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { format } from 'date-fns';
import * as echarts from 'echarts';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit {
  @Input() data: any;
  @Input() id: any;

  @ViewChild('container', { static: true }) containerElement!: ElementRef<HTMLElement>;

  // Variable con el tipo de graficas
  type: Array<string> = [
    "line",
    "bar",
    "gauge",
    "number"
  ]

  // Variable con el tipo de operaciones
  operation: Array<string> = [
    "Máximo",
    "Mínimo",
    "Último"
  ];

  // 1: max, 2: min, 3: last
  opColor: Array<string> = [
    environment.maxColor,
    environment.minColor,
    environment.lastColor
  ];

  // Estrucutra de los iconos
  icons = environment.icons;

  ngAfterViewInit(): void {
    this.chart();
  }

  decimals(num: number, dec: number){
    return num.toFixed(dec);
  }

  chart(){
    this.data.forEach((data: any, index: number) => {
      console.log(data)

      if(data.type !== 3){
        const div = document.createElement('div');
        div.id = `chart${this.id + index}`;
        div.style.height = '400px';
        div.classList.add('echart');

        const body = document.createElement('div');
        body.classList.add('card-body');
        body.style.padding = '20px';
        body.appendChild(div);

        const card = document.createElement('div');
        card.classList.add('card');
        card.appendChild(body);

        const bootstrap = document.createElement('div');
        if(data.columns){
          bootstrap.classList.add("col-lg-4");
        }
        else{
          bootstrap.classList.add("col-lg-12");
        }
        bootstrap.appendChild(card);

        this.containerElement.nativeElement.appendChild(bootstrap);

        const graph = echarts.init(div);
        // Función para que se adapte el tamaño e a grafica si se cambia el tamaño de la pantalla
        window.addEventListener('resize', function() {
          graph.resize();
        });





        if(data.dates){
          for (let i = 0; i < data.dates.length; i++){
            data.dates[i] = data.dates[i].slice(0, -1);
            data.dates[i] = format(new Date(data.dates[i]), "dd/MM/y p");
          }
        }

        let option;

        // Comprobar el tipo de gráfica que es
        switch(data.type){
          case 0:
            // Gráfica de lineas
          case 1:
            // Grafica de barras

            // Para añadir la unidad en el tooltip de la gráfica
            for (let value of data.values){
              value.tooltip = {
                valueFormatter: (value: any) => value + ` ${data.metric}`
              }
            }

            option = {
              title: {
                text: data.title,
                textStyle: {
                  overflow: 'break',
                }
              },
              tooltip: {
                trigger: 'axis',
                confine: true
              },
              legend: {
                data: data.ids,
                type: 'scroll',
                pageButtonPosition: 'start'
              },
              xAxis: {
                type: 'category',
                data: data.dates
              },
              yAxis: {
                type: 'value',
                axisLabel: {
                  formatter: `{value}${data.metric}`
                }
              },
              grid: {
                containLabel: true,
              },
              dataZoom: [
                {
                  type: 'inside',
                  start: 0,
                  end: 100
                },
                {
                  start: 0,
                  end: 100
                }
              ],
              series: data.values,
              media: [{
                query: {
                  maxWidth: 360,
                },
                option: {
                  title: {
                    textStyle: {
                      width: 250
                    }
                  },
                  grid: {
                    top: '25%' // Espacio en la parte superior de la grafica
                  },
                  legend: {
                    top: '15%'
                  }
                }
                },
                {
                  query: {
                    minWidth: 361,
                  },
                  option: {
                    title: {
                      textStyle: {
                        width: 500
                      }
                    },
                    grid: {
                      top: '20%' // Espacio en la parte superior de la grafica
                    },
                    legend: {
                      top: '10%'
                    }
                  }
                }
              ]
            };

            graph.setOption(option);

            break;

          case 2:
            div.style.height = '300px';
            graph.resize();

            // Gauge
            option = {
              tooltip: {
                formatter: `{a} <br/>{b} : {c}`,
                confine: true
              },
              title: {
                text: data.title,
                textStyle: {
                  overflow: 'break',
                }
              },
              series: [
                {
                  name: data.description,
                  type: this.type[data.type],
                  center: ["50%", "60%"],
                  progress: {
                    show: true
                  },
                  title: {
                    show: true,
                    offsetCenter: ["0", "40%"]
                  },
                  detail: {
                    valueAnimation: true,
                    fontSize: 20,
                    formatter: '{value}',
                    offsetCenter: ["0", "60%"]
                  },
                  axisLabel: {
                    fontSize: 10
                  },
                  anchor: {
                    show: true,
                    showAbove: true,
                    offsetCenter: [0, -50],
                    size: 20,
                    icon: `path://${this.icons[data.icon].path}`,
                    keepAspect: true,
                    itemStyle: {
                      color: '#000'
                    }
                  },
                  silent: true,
                  data: [
                    {
                      value: this.decimals(data.values[0], data.decimals),
                      name: data.metric
                    }
                  ]
                }
              ],
              media: [{
                query: {
                  maxWidth: 360,
                },
                option: {
                  title: {
                    textStyle: {
                      width: 350
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
                      textStyle: {
                        width: 500
                      }
                    }
                  }
                }
              ]
            }

            graph.setOption(option);

            break;

          default:
            break;
        }
      }
      else{
        //Solo el valor, no se hace con echarts para poder personalizar más
        let card =
        `<div id="chart${this.id + index}" class="card text-center">
            <div class="p-4">
                <h6>${format(new Date(data.date), "dd/MM/y p")}</h6>
                <h6>${this.operation[data.operation - 2]}:</h6>
                <h2>`;

        if(this.icons[data.icon].path !== ""){
          card += `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                      <path d="${this.icons[data.icon].path}"/>
                  </svg>`
        }

        card += `<span>${this.decimals(data.values[0], data.decimals)} ${data.metric}</span></h2>
                <h5>${data.title}</h5>
                <p>${data.description}</p></div></div>`;


        let div = document.createElement('div');
        div.classList.add("col-lg-4");
        div.innerHTML = card;

        this.containerElement.nativeElement.appendChild(div);

        let col = document.getElementById(`chart${this.id + index}`);
        col!.style.color = data.colorValue;
        col!.style.backgroundColor = data.colorBackground;


      }
    });
  }
}
