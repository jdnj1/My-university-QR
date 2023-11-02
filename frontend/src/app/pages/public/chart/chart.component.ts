import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { format } from 'date-fns';
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
    div.style.height = '350px';
    div.classList.add('echart');

    this.containerElement.nativeElement.appendChild(div);

    const graph = echarts.init(div);



    // Función para que se adapte el tamaño e a grafica si se cambia el tamaño de la pantalla
    window.addEventListener('resize', function() {
      graph.resize();
    });

    // let grid = 0;
    // if(this.data.ids){
    //   grid = Math.round(this.data.ids.length / 2) * 10;
    // }
    // console.log(grid)

    //let grid = 20;

    if(this.data.dates){
      for (let i = 0; i < this.data.dates.length; i++){
        this.data.dates[i] = this.data.dates[i].slice(0, -1);
        this.data.dates[i] = format(new Date(this.data.dates[i]), "Pp");
      }
    }

    let option;

    // Comprobar el tipo de gráfica que es
    switch(this.data.type){
      case 0:
        // Gráfica de lineas
      case 1:
        // Grafica de barras

        // Para añadir la unidad en el tooltip de la gráfica
        for (let value of this.data.values){
          value.tooltip = {
            valueFormatter: (value: any) => value + ` ${this.data.metric}`
          }
        }

        console.log(this.data.values)
        // let pru = 350 + grid
        // div.style.height = `${pru}px`;
        // console.log( pru)
        // graph.resize();

        option = {
          title: {
            text: this.data.title
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: this.data.ids,
            top: '10%',
            type: 'scroll',
            pageButtonPosition: 'start'
          },
          xAxis: {
            type: 'category',
            data: this.data.dates
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: `{value} ${this.data.metric}`
            }
          },
          grid: {
            top: '20%', // Espacio en la parte superior de la grafica
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
        div.style.height = '300px';
        graph.resize();

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
        div.style.height = '200px';
        graph.resize();

        // Solo el valor
        option = {
          title: {
            text: `Máximo: ${this.data.values[0]} ${this.data.metric}\n`,
            subtext: `\n${this.data.title}: \n\n ${this.data.description}`,
            left: "center",
            top: "center",
            textStyle: {
              fontSize: 30,
              width: 350,
              overflow: 'break',
            },
            subtextStyle: {
              width: 550,
              overflow: 'break',
            }
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
