import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { ConsultService } from 'src/app/services/consult.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { environment } from '../../../../environments/environment';
import { format } from 'date-fns';

@Component({
  selector: 'app-consult-form',
  templateUrl: './consult-form.component.html',
  styleUrls: ['./consult-form.component.css']
})
export class ConsultFormComponent implements OnInit, OnDestroy {

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
   firstForm = this.fb.group({
    name: ['', Validators.required],
    token: ['', Validators.required],
    dateFrom: ['', Validators.required],
    dateTo: ['', Validators.required],
    filters: [''],
    operation:[1],
    chart: [0]
  });

  // Form para los filtros
  filterForm: FormGroup = this.fb.group({
  });

  // Form para las llamadas de max, min o last
  operationForm: FormGroup = this.fb.group({
    uid: ['', Validators.required],
    name: ['', Validators.required]
  });

  // Form para las fechas relativas
  relativeForm: FormGroup = this.fb.group({
    number: [0],
    unit: ['1'],
  })

  urlChart = '';

  // Booleano para comprobar si se han realizado cambios en el formulario
  hasChanges: Boolean = false;

  firstFormSubscription: any;
  relativeFormSubscription: any;
  filterFormSubscription: any;
  operationFormSubscription: any;

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private consultService: ConsultService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router
  ){

  }

  ngOnInit(): void {
    this.getConsult();

    // Se almacenan las opciones de filtro en el array
    this.options = environment.filters;
  }

  ngOnDestroy(): void {
    // Liberar recursos
    this.firstFormSubscription.unsubscribe();
    this.relativeFormSubscription.unsubscribe();
    this.filterFormSubscription.unsubscribe();
    this.operationFormSubscription.unsubscribe();
  }

  getConsult(){
    // Se obtienen los datos de la consulta de la base de datos a partir de la id de la url
    // Se almacena el id de la consulta
    let id: any = this.route.snapshot.params['id'];

    this.consultService.getConsultbyId(id).subscribe({
      next: (res: any) => {
        console.log(res);

        this.consult =  res.consult;

        console.log(this.consult)
        // Se adaptan las fechas
        this.consult.dateFrom = new Date(this.consult.dateFrom);
        this.consult.dateFrom = format(this.consult.dateFrom, "yyyy-MM-dd'T'HH:mm:ss.SSS");

        this.consult.dateTo = new Date(this.consult.dateTo);
        this.consult.dateTo = format(this.consult.dateTo, "yyyy-MM-dd'T'HH:mm:ss.SSS");

        // Se rellenan los datos del formulario con los datos de la consulta
        this.firstForm = this.fb.group({
          name: [this.consult.name],
          token: [this.consult.token],
          dateFrom: [this.consult.dateFrom],
          dateTo: [this.consult.dateTo],
          filters: '',
          operation: [this.consult.operation],
          chart: [this.consult.chart]
        });

        // Se comprubeba que tipo de representacion tiene la llamada
        if(this.consult.chart === 0){
          this.urlChart = environment.charts[0];
        }
        else if(this.consult.chart === 1){
          this.urlChart = environment.charts[1];
        }
        else if(this.consult.chart === 2){
          this.urlChart = environment.charts[2];
        }
        else if(this.consult.chart === 3){
          this.urlChart = environment.charts[3];
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
            console.log(this.filtersArray);

            // Pasamos las keys al array
            this.keys = Object.keys(this.consult.filters);
            console.log(this.keys);

            // Agregamos los filtros al formulario
            for(let i = 0; i < this.filtersArray.length; i ++){
              this.filterForm.addControl(this.keys[i], this.fb.control(this.filtersArray[i]));
            }
          }
        }


        // Nos suscribimos a los cambios que puedan tener los fomrmularios
        this.firstFormSubscription = this.firstForm.valueChanges.subscribe(() => {
          this.hasChanges = true;
        });

        this.relativeFormSubscription = this.relativeForm.valueChanges.subscribe(() => {
          this.hasChanges = true;
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
        this.alertService.error('Error al obtener la llamada');
      }
    });
  }

  updateConsult(){
    // Se realizan todas las comprobaciones necesarias antes de actualizar
    // En caso de que este seleccionada la fecha absoluta
    if(!this.date){
      // Comprobar que la fecha hasta no sea anterior a la fecha desde
      let dateFrom = this.firstForm.get('dateFrom')?.value;
      let dateTo = this.firstForm!.get('dateTo')?.value;

      if(dateFrom != null && dateFrom != undefined && dateTo != null && dateTo != undefined){
        if(dateFrom >= dateTo){
          this.alertService.error("La fecha 'Hasta' no puede ser anterior a la fecha 'Desde'");
          return;
        }
      }
    }
    // En caso de que este seleccionada la fecha relativa
    else{
      let now = new Date();
      let result;
      let num = this.relativeForm.get('number')?.value;

      // Se pasa el numero introducido a milisegundos en todos los casos
      switch(this.relativeForm.get('unit')?.value){
        case '1':
          // De segundos a milisegundos
          num *= 1000;
          break;

        case '2':
          // De minutos a milisegundos
          num *= 60 * 1000;
          break;

        case '3':
          // De horas a milisegundos
          num *= 3600 * 1000;
          break;

        case '4':
          // De dias a milisegundos
          num *= 24 * 3600 * 1000
          break;

        default:
          break;
      }

      result = new Date(now.getTime() - num);

      this.firstForm.get('dateFrom')?.setValue(result.toISOString());
      this.firstForm.get('dateTo')?.setValue(now.toISOString());
    }

    // Montar el campo de los filtros.
    let json = `{`;

    if(Number(this.firstForm.value.operation) > 1){

      // Se comprueba que se hayan introducido los campos necesarios
      if(!this.operationForm.valid){
        this.alertService.error("Los campos UID y Magnitud deben tener un valor");
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
    // Se añade este campo al primer forumulario que es el que se envia al update
    this.firstForm.setControl('filters', new FormControl(json));

    this.consultService.updateConsult(this.firstForm.value ,this.consult.idConsult).subscribe({
      next: (res: any) => {
        this.alertService.success('Llamada actualizada correctamente');
        this.hasChanges = false;
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error('Error al acutalizar la llamada')
        console.log(err);
      }
    });
  }

  changeDateTrue(){
    this.date = !this.date;
    console.log(this.date)
  }

  selectData(){
    if(Number(this.firstForm.value.operation) > 1){
      this.filters = false;
    }
    else {
      this.filters = true;
    }
  }

  selectChart(event: any){
    this.urlChart = environment.charts[event.target.value]
  }

  addFilter(){
    this.filtersArray.push('');
    if(this.keys.length === 0){
      this.keys.push(`uid`);
      // Agregamos un nuevo campo al formulario de los filtros
      this.filterForm.addControl(`uid`, this.fb.control(''));
    }
    else{
      this.keys.push(`newKey ${this.keys.length+1}`);
      // Agregamos un nuevo campo al formulario de los filtros
      this.filterForm.addControl(`newKey ${this.keys.length}`, this.fb.control(''));
    }



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
    this.router.navigateByUrl(`codeQr/${this.consult.qrCode}`)
  }

}
