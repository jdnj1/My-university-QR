import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as echarts from 'echarts';

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


  ngAfterViewInit(): void {
    this.chart();
  }

  chart(){
    console.log(this.data)

    const div = document.createElement('div');
    div.id = `chart${this.id}`;
    div.style.minHeight = '400px';
    div.classList.add('echart');

    this.containerElement.nativeElement.appendChild(div);

    const graph = echarts.init(div);

    // Función para que se adapte el tamaño e a grafica si se cambia el tamaño de la pantalla
    window.addEventListener('resize', function() {
      graph.resize();
    });

    let option;

    // Comprobar el tipo de gráfica que es
    switch(this.data.type){
      case 0:
        // Gráfica de lineas
      case 1:
        // Grafica de barras

        option = {
          title: {
            text: this.data.title,
            // textStyle: {
            //   ellipsis: true
            // },
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: this.data.ids,
            top: '10%'
          },
          xAxis: {
            type: 'category',
            data: this.data.dates
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
              end: 100
            },
            {
              start: 0,
              end: 100
            }
          ],
          series: this.data.values
        };

        graph.setOption(option);

        break;

      case 2:
        // Gauge
        option = {
          tooltip: {
            formatter: `{a} <br/>{b} : {c}`
          },
          title: {
            text: this.data.title
          },
          series: [
            {
              name: this.data.description,
              type: this.type[this.data.type],
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
                  value: this.data.values[0],
                  name: this.data.metric
                }
              ]
            }
          ]
        }

        graph.setOption(option);

        break;

      case 3:
        // Solo el valor
        option = {
          title: {
            text: `${this.data.values[0]} ${this.data.metric}`,
            subtext: `${this.data.title}: \n\n ${this.data.description}`,
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

        graph.setOption(option);

        break;

      default:
        break;
    }
  }
}
