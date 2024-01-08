import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultService } from 'src/app/services/consult.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { environment } from '../../../../environments/environment';
import { formatInTimeZone, toDate } from 'date-fns-tz';
import { TranslateService } from '@ngx-translate/core';
import * as echarts from 'echarts';
import { lastValueFrom } from 'rxjs';
import { QrService } from 'src/app/services/qr.service';


@Component({
  selector: 'app-consult-form',
  templateUrl: './consult-form.component.html',
  styleUrls: ['./consult-form.component.css']
})
export class ConsultFormComponent implements OnInit, OnDestroy {

  @ViewChild('preview', { static: true }) previewElement!: ElementRef<HTMLElement>;

  //Para que la gráfica se redimensiona cuando se mueve la barra lateral
  @HostListener('transitionend', ['$event'])
  onTransitionEnd(event: TransitionEvent): void {
    if(event.propertyName === 'margin-left'){
      this.resizeBar();
    }

  }

  //Obtenemos el id del QR y de la llamada a partir de la url
  idQr = this.route.snapshot.params['idQr'];
  idCon = this.route.snapshot.params['idCon'];

  // En esta variable se almacenan los datos de la consulta a configurar
  consult: any;

  // Array donde se almacenan los filtros
  filtersArray: any = [];

  // Array donde se almacenan las keys de los filtros
  keys: any = [];

  // Array donde se almacenan las ocpiones de filtros de smart university indicados en las variables de entorno
  options: any = [];

  // variable para indicar que tipo de fecha se selecciona
  date: boolean = false;

  // variable para indicar que tipos de datos se van a introducir
  filters: boolean = true;

   // Form de la primera parte
  firstForm = this.fb.nonNullable.group({
    name: [''],
    token: ['', Validators.required],
    dateFrom: [''],
    dateTo: [''],
    typeDate: [0 , Validators.required],
    filters: [''],
    operation: [1],
    chart: [0],
    colorVal: ['#000000'],
    colorBack: ['#ffffff'],
    icon: [0],
    number: [0],
    unit: [1],
    decimals: [2],
    qrCode: [this.idQr]
  });

  // Form para los filtros
  filterForm: FormGroup = this.fb.group({
  });

  // Form para las llamadas de max, min o last
  operationForm: FormGroup = this.fb.group({
    uid: ['', Validators.required],
    name: ['', Validators.required]
  });

  activateForm = this.fb.group({
    activated: [false]
  });

  urlChart = environment.charts[0];

  // Booleano para comprobar si se han realizado cambios en el formulario
  hasChanges: Boolean = false;

  // Booleano para indicar si se va a crear una nueva llamada
  create: boolean = this.idCon === '0'? true : false;

  // Booleano para indicar si se va a duplicar una llamada
  duplicate: boolean = this.idCon.at(this.idCon.length - 1) === '*' ? true: false;

  formSubmit: boolean = false;

  firstFormSubscription: any;
  filterFormSubscription: any;
  operationFormSubscription: any;

  nameQr: string = '';

  // Estructura de los iconos
  icons = environment.icons;

  // Zona horaria
  timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;



  constructor(
    private fb: FormBuilder,
    private consultService: ConsultService,
    private qrService: QrService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
    private translateService: TranslateService
  ){

  }

  ngOnInit(): void {

    this.getNameQr();

    if(!this.create){
      this.getConsult();
    }
    else{
      this.initGraph();
      // Nos suscribimos a los cambios que puedan tener los formularios
      this.firstFormSubscription = this.firstForm.valueChanges.subscribe((newValue) => {
        this.hasChanges = true;
        this.resizeGraph();
      });

      this.filterFormSubscription = this.filterForm.valueChanges.subscribe(() => {
        this.hasChanges = true;
      });

      this.operationFormSubscription = this.operationForm.valueChanges.subscribe(() => {
        this.hasChanges = true;
      });
    }
    // Se almacenan las opciones de filtro en el array
    this.options = environment.filters;

    if(this.duplicate) this.hasChanges = true;

  }

  ngOnDestroy(): void {
    // Liberar recursos
    this.firstFormSubscription.unsubscribe();
    this.filterFormSubscription.unsubscribe();
    this.operationFormSubscription.unsubscribe();
  }

  campoValido(campo: string){
    return this.firstForm.get(campo)?.valid || !this.formSubmit;
  }

  async getNameQr(){
    let id = this.idQr;

    if(this.duplicate) id = id.slice(0, -1);

    let qr: any = await lastValueFrom(this.qrService.getQrbyId(this.idQr));
    this.nameQr = qr.qr.description;
  }

  getConsult(){

    this.consultService.getConsultbyId(this.idCon).subscribe({
      next: (res: any) => {

        this.consult =  res.consult;
        console.log(res.consult)

        console.log(this.timezone)
        console.log(toDate(this.consult.dateFrom) , {timeZone: this.timezone});
        let pru = toDate(this.consult.dateFrom, {timeZone: this.timezone});
        console.log(formatInTimeZone(pru, this.timezone, "yyyy-MM-dd'T'HH:mm:ss.SSS"))
        console.log(this.consult.dateFrom)
        console.log(formatInTimeZone(this.consult.dateFrom, this.timezone, "yyyy-MM-dd'T'HH:mm:ss.SSS"))

        // Se adaptan las fechas
        this.consult.dateFrom = toDate(this.consult.dateFrom, {timeZone: this.timezone});
        this.consult.dateFrom = formatInTimeZone(this.consult.dateFrom, this.timezone, "yyyy-MM-dd'T'HH:mm:ss.SSS");

        this.consult.dateTo = toDate(this.consult.dateTo, {timeZone: this.timezone});
        this.consult.dateTo = formatInTimeZone(this.consult.dateTo, this.timezone, "yyyy-MM-dd'T'HH:mm:ss.SSS");

        // Se coprueba el tipo de fecha seleccionado Absoluta/Relativa
        if(this.consult.typeDate === 0){
          this.date = false;
        }
        else{
          this.date = true;
        }

        // Se rellenan los datos del formulario con los datos de la consulta
        if(this.duplicate){
          this.firstForm.get('name')?.setValue(`${this.consult.name } (copia)`);
        }
        else{
          this.firstForm.get('name')?.setValue(this.consult.name);
        }

        this.firstForm.get('token')?.setValue(this.consult.token);
        this.firstForm.get('dateFrom')?.setValue(this.consult.dateFrom);
        this.firstForm.get('dateTo')?.setValue(this.consult.dateTo);
        this.firstForm.get('typeDate')?.setValue(this.consult.typeDate);
        this.firstForm.get('filters')?.setValue(this.consult.filters);
        this.firstForm.get('operation')?.setValue(this.consult.operation);
        this.firstForm.get('chart')?.setValue(this.consult.chart);
        this.firstForm.get('colorVal')?.setValue(this.consult.colorVal);
        this.firstForm.get('colorBack')?.setValue(this.consult.colorBack);
        this.firstForm.get('icon')?.setValue(this.consult.icon);
        this.firstForm.get('number')?.setValue(this.consult.number);
        this.firstForm.get('unit')?.setValue(this.consult.unit);
        this.firstForm.get('decimals')?.setValue(this.consult.decimals);
        this.firstForm.get('qrCode')?.setValue(this.consult.qrCode);

        this.initGraph();

        if(this.consult.activated === 1){
          this.activateForm = this.fb.group({
            activated: [true]
          });
        }
        else{
          this.activateForm = this.fb.group({
            activated: [false]
          });
        }

        // Pasamos los filtros a JSON si tiene
        if(this.consult.filters !== ''){
          this.consult.filters = JSON.parse(this.consult.filters);

          if(Number(this.firstForm.value.operation) > 1){
            this.filters = false;

            this.operationForm.get('uid')?.setValue(Object.values(this.consult.filters)[0]);
            this.operationForm.get('name')?.setValue(Object.values(this.consult.filters)[1]);
          }
          else if(this.consult.filters !== ''){
            // Pasamos los filtros al array
            this.filtersArray = Object.values(this.consult.filters);

            // Pasamos las keys al array
            this.keys = Object.keys(this.consult.filters);

            // Agregamos los filtros al formulario
            for(let i = 0; i < this.filtersArray.length; i ++){
              this.filterForm.addControl(this.keys[i], this.fb.control(this.filtersArray[i]));
            }
          }
        }


        // Nos suscribimos a los cambios que puedan tener los formularios
        this.firstFormSubscription = this.firstForm.valueChanges.subscribe(() => {
          this.hasChanges = true;
          this.resizeGraph();
        });

        this.filterFormSubscription = this.filterForm.valueChanges.subscribe(() => {
          this.hasChanges = true;
        });

        this.operationFormSubscription = this.operationForm.valueChanges.subscribe(() => {
          this.hasChanges = true;
        });

      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.alertService.error(this.translateService.instant('alert.cons.get'));
      }
    });
  }

  updateConsult(){
    // Se realizan todas las comprobaciones necesarias antes de actualizar
    // En caso de que este seleccionada la fecha absoluta
    if(!this.date){
      // Comprobar que la fecha hasta no sea anterior a la fecha desde
      let dateFrom = this.firstForm.get('dateFrom')?.value;
      let dateTo = this.firstForm.get('dateTo')?.value;

      if(dateFrom !== null && dateFrom !== undefined && dateFrom !== '' && dateTo !== null && dateTo !== undefined && dateTo !== ''){
        if(dateFrom >= dateTo){
          this.alertService.error(this.translateService.instant('alert.cons.dates'));
          return;
        }
      }
      else{
        this.alertService.error(this.translateService.instant('alert.cons.date.error'));
        return;
      }
    }
    // En caso de que este seleccionada la fecha relativa
    else{

      // Si la cantidad a restar a la fecha actual es 0 se avisa
      if(this.firstForm.value.number === 0){
        this.alertService.error(this.translateService.instant('alert.cons.quant'));
        return;
      }
    }

    // Montar el campo de los filtros.
    let json = `{`;

    if(Number(this.firstForm.value.operation) > 1){

      // Se comprueba que se hayan introducido los campos necesarios
      if(!this.operationForm.valid){
        this.alertService.error(this.translateService.instant('alert.cons.field'));
        return;
      }

      Object.keys(this.operationForm.controls).forEach((key, index) => {
        json += `"${key}":"${this.operationForm.get(key)?.value}"`;

        if(index !== Object.keys(this.operationForm.controls).length - 1){
          json += ','
        }
      });
    }
    else{
      Object.keys(this.filterForm.controls).forEach((key, index) => {
        json += `"${key}":"${this.filterForm.get(key)?.value}"`;

        if(index !== Object.keys(this.filterForm.controls).length - 1){
          json += ','
        }
      });
    }

    json += `}`;
    // Se añade este campo al primer formulario que es el que se envia al update
    this.firstForm.setControl('filters', this.fb.nonNullable.control(json));

    // Se comprueba si se va a crear, duplicar o a editar una llamada
    if(this.create || this.duplicate){

      this.formSubmit = true;
      // Se crea el qr si el formulario no tiene errores
      if (!this.firstForm.valid) {
        return;
      }

      // Se crea
      this.consultService.createConsult(this.firstForm.value).subscribe({
        next: (res: any) => {
          this.idCon = res.consult;
          this.hasChanges = false;
          this.create = false;

          if(this.duplicate){
            this.duplicate = false;
            this.idQr = this.consult.qrCode;
          }


          // Liberar recursos
          this.firstFormSubscription.unsubscribe();
          this.filterFormSubscription.unsubscribe();
          this.operationFormSubscription.unsubscribe();

          this.getConsult();
          this.router.navigateByUrl(`consult/${this.idQr}/${this.idCon}`);
          this.alertService.success(this.translateService.instant('alert.cons.create'));
        },
        error: (err: HttpErrorResponse) => {
          this.alertService.error(this.translateService.instant('alert.cons.update.error'));
          console.log(err);
        }
      });
    }
    else{
      // Se edita
      this.consultService.updateConsult(this.firstForm.value ,this.consult.idConsult).subscribe({
        next: (res: any) => {
          this.alertService.success(this.translateService.instant('alert.cons.update'));
          this.hasChanges = false;
        },
        error: (err: HttpErrorResponse) => {
          this.alertService.error(this.translateService.instant('alert.cons.update.error'));
          console.log(err);
        }
      });
    }

  }

  selectData(){
    const value = Number(this.firstForm.value.operation);
    const chart = Number(this.firstForm.value.chart);

    if(value > 1){
      this.filters = false;
      if( chart !== 2 && chart !== 3 ){
        this.firstForm.get('chart')?.setValue(2);
        this.urlChart = environment.charts[2];
      }


    }
    else {
      this.filters = true;
      this.firstForm.get('chart')?.setValue(0);
      this.urlChart = environment.charts[0];
    }
  }

  selectChart(event: any){
    this.firstForm.get('chart')?.setValue(Number(event.target.value))
  }

  addFilter(){
    this.filtersArray.push('');

    // Busca el primer filtro que no este en la lista de filtros utilizados
    let opt = this.options.find((key: any) => !this.keys.includes(key));

    // Agregamos un nuevo campo al formulario de los filtros
    this.filterForm.addControl(this.options[this.options.indexOf(opt)], this.fb.control(''));

    this.keys.push(this.options[this.options.indexOf(opt)]);

  }

  deleteFilter(index: any, key: string){
    this.filtersArray.splice(index, 1);
    this.keys.splice(index, 1);

    this.filterForm.removeControl(key);
  }

  onChange(index: any, key: string, event: any){
    const newKey = event.target.value;

    this.keys[index] = newKey;

    // Actualizar el campo del formulario
    const control = this.filterForm.get(key);

    this.filterForm.setControl(newKey, control);
    this.filterForm.removeControl(key);

  }

  cancel(){
    if(this.duplicate){
      this.router.navigateByUrl(`codeQr/${this.consult.qrCode}`)
    }
    else{
      this.router.navigateByUrl(`codeQr/${this.idQr}`)
    }

  }

  activateConsult(){
    let value;
    let msg: string;

    if(!this.activateForm.value.activated){
      value = {activated: 0};
      msg= this.translateService.instant('alert.cons.deactivated');
    }
    else{
      value = {activated: 1};
      msg= this.translateService.instant('alert.cons.activated');
    }

    //actualizamos el atributo activado de la base de datos.
    this.consultService.updateConsult(value, this.consult.idConsult).subscribe({
      next: (res:any) =>{
        this.alertService.success(msg);
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error(this.translateService.instant('alert.qr.update.error'));
      }
    })
  }

  dateAbsolute(){
    this.date = false;
    this.firstForm.get('typeDate')?.setValue(0);
  }

  dateRelative(){
    this.date = true;
    this.firstForm.get('typeDate')?.setValue(1);
  }

  getChart(){
    let chart =  this.firstForm.value.chart;

    if (chart !== null && chart !== undefined){
      return chart === 3;
    }
    else{
      return false;
    }
  }

  initGraph(){

    if(echarts.getInstanceByDom(this.previewElement.nativeElement) !== undefined){
      return;
    }

    const graph = echarts.init(this.previewElement.nativeElement);

    // Función para que se adapte el tamaño e a grafica si se cambia el tamaño de la pantalla
    window.addEventListener('resize', function() {
      graph.resize();
    });

    this.resizeGraph();
  }

  resizeGraph(){

    this.previewElement.nativeElement.style.width = this.previewElement.nativeElement.style.width;

    const graph = echarts.getInstanceByDom(this.previewElement.nativeElement);

    const chart = this.firstForm.value.chart;

    let icon = this.firstForm.value.icon !== undefined ? this.firstForm.value.icon : 0;

    let option;

    switch(chart){
      //lineas
      case 0:
        option = {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [5, 10, 4, 12, 3, 1, 10],
              type: 'line'
            }
          ]
        }

        graph?.setOption(option, true);
        break;

      //barras
      case 1:
        option = {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [150, 230, 224, 218, 135, 147, 260],
              type: 'bar'
            }
          ]
        }

        graph?.setOption(option, true);
        break;

      //gauge
      case 2:
        option = {
          series: [
            {
              type: 'gauge',
              name: 'form',
              data: [
                {
                  value: 70,
                }
              ],
              splitLine: {
                show: false
              },
              axisTick: {
                show: true,
                distance: 3
              },
              axisLabel: {
                distance: 3.5
              },
              anchor: {
                show: true,
                showAbove: true,
                offsetCenter: [0, -40],
                size: 20,
                icon: `path://${this.icons[icon].path}`,
                keepAspect: true,
                itemStyle: {
                  color: '#000'
                }
              }
            }
          ]
        }

        graph?.setOption(option, true);
        break;

      //valor
      case 3:

        option = {
          backgroundColor: this.firstForm.value.colorBack,
          series: [
           {
             type: 'gauge',
             data: [
               {
                 value: 70,
               }
             ],
             detail: {
               fontSize: 70,
               formatter: '{value}',
               offsetCenter: ["0", "0"],
               color: this.firstForm.value.colorVal
             },
             anchor: {
               show: true,
               showAbove: true,
               offsetCenter: [0, -70],
               size: 30,
               icon: `path://${this.icons[icon].path}`,
               keepAspect: true,
               itemStyle: {
                 color: this.firstForm.value.colorVal
               }
             },
             splitLine: {
               show: false
             },
             axisTick: {
               show: false,
             },
             axisLabel: {
               show: false,
             },
             axisLine: {
               show: false,
             },
             pointer: {
               show: false
             },
             progress: {
               show: false,
             }
           }
         ]
       }

        graph?.setOption(option, true);
        break;
    }
  }

  resizeBar(){
    const graph = echarts.getInstanceByDom(this.previewElement.nativeElement);
    graph?.resize()
  }
}
