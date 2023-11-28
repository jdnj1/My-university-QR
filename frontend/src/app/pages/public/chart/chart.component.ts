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

  ngAfterViewInit(): void {
    console.log(this.data)
    this.chart();
  }

  decimals(num: number, dec: number){
    return num.toFixed(dec);
  }

  chart(){
    this.data.forEach((data: any, index: number) => {


      const div = document.createElement('div');
      div.id = `chart${this.id + index}`;
      div.style.height = '350px';
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
          data.dates[i] = format(new Date(data.dates[i]), "Pp");
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
              text: data.title
            },
            tooltip: {
              trigger: 'axis',
              confine: true
            },
            legend: {
              data: data.ids,
              top: '10%',
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
              top: '20%', // Espacio en la parte superior de la grafica
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
            series: data.values
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
              text: data.title
            },
            series: [
              {
                name: data.description,
                type: this.type[data.type],
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
                    value: this.decimals(data.values[0], data.decimals),
                    name: data.metric
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
              text: `{date|${format(new Date(data.date), "Pp")}}\n${this.operation[data.operation - 2]}: ${this.decimals(data.values[0], data.decimals)} ${data.metric}\n`,
              subtext: `\n${data.title}: \n\n ${data.description}`,
              left: "center",
              top: "15%",
              textStyle: {
                fontSize: 30,
                width: 300,
                color: data.colorValue,
                overflow: 'break',
                rich:{
                  date: {
                    color: data.colorValue,
                    padding: 10
                  }
                }
              },
              subtextStyle: {
                width: 550,
                overflow: 'break',
                color: data.colorValue
              }
            },
            backgroundColor: data.colorBackground,
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
    });
  }
}
