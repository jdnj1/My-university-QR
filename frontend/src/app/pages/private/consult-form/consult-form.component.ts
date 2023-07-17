import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConsultService } from 'src/app/services/consult.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-consult-form',
  templateUrl: './consult-form.component.html',
  styleUrls: ['./consult-form.component.css']
})
export class ConsultFormComponent implements OnInit{

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
    chart: 0
  });

  // Form de la segunda parte
  secondForm = this.fb.group({
    data: ['1', Validators.required],
  });

  // Form para los filtros
  filterForm: FormGroup = this.fb.group({
  });

  // Form para las fechas relativas
  relativeForm: FormGroup = this.fb.group({
    number: [0],
    unit: ['1'],
  })

  // Booleanos para controlar el tipo de grafica que se selecciona para representar
  lines: boolean = false;
  bars: boolean = false;
  gauge: boolean = false;
  number: boolean = false;

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private consultService: ConsultService,
    private route: ActivatedRoute,
    private alertService: AlertService
  ){

  }

  ngOnInit(): void {
    this.getConsult();

    // Se almacenan las opciones de filtro en el array
    this.options = environment.filters;
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
        this.consult.dateFrom = this.consult.dateFrom.slice(0, -1);
        this.consult.dateTo = this.consult.dateTo.slice(0, -1);

        // Se rellenan los datos del formulario con los datos de la consulta
        this.firstForm = this.fb.group({
          name: [this.consult.name],
          token: [this.consult.token],
          dateFrom: [this.consult.dateFrom],
          dateTo: [this.consult.dateTo],
          filters: '',
          chart: [this.consult.chart]
        });

        // Se comprubeba que tipo de representacion tiene la llamada
        if(this.consult.chart === 0){
          this.lines = true;
        }
        else if(this.consult.chart === 1){
          this.bars = true;
        }
        else if(this.consult.chart === 2){

        }
        else if(this.consult.chart === 3){

        }

        if(this.consult.filters !== ''){
          // Pasamos los filtros a JSON
          this.consult.filters = JSON.parse(this.consult.filters);
          console.log(this.consult.filters)

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
    Object.keys(this.filterForm.controls).forEach((key, index) => {
      json += `"${key}":"${this.filterForm.get(key)?.value}"`;

      if(index !== Object.keys(this.filterForm.controls).length - 1){
        json += ','
      }

    });

    json += `}`;
    // Se añade este campo al primer forumulario que es el que se envia al update
    this.firstForm.setControl('filters', new FormControl(json));
    console.log(this.firstForm.value)

    // Se comprueba que grafica se ha seleccionado
    if(this.lines){
      this.firstForm.get('chart')?.setValue(0);
    }
    else if(this.bars){
      this.firstForm.get('chart')?.setValue(1);
    }
    else if(this.bars){
      this.firstForm.get('chart')?.setValue(1);
    }
    else if(this.bars){
      this.firstForm.get('chart')?.setValue(1);
    }

    this.consultService.updateConsult(this.firstForm.value ,this.consult.idConsult).subscribe({
      next: (res: any) => {
        this.alertService.success('Llamada actualizada correctamente');
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error('Error al acutalizar la llamada')
        console.log(err);
      }
    });
  }

  changeDate(){
    this.date = !this.date;
  }

  selectData(){
    if(Number(this.secondForm.value.data) > 1){
      this.filters = false;
    }
    else {
      this.filters = true;
    }
  }

  addFilter(){
    this.filtersArray.push('');
    this.keys.push(`newKey ${this.keys.length+1}`);

    // Agregamos un nuevo campo al formulario de los filtros
    this.filterForm.addControl(`newKey ${this.keys.length}`, this.fb.control(''));
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

  // Funcion para pasar todos los controles de un formulario a otro
  // addAllcontrols(from: FormGroup, to: FormGroup){
  //   Object.keys(from.controls).forEach(key => {
  //     to.addControl(key, from.get(key));
  //   });
  // }

  line(){
    this.lines = true;
    this.bars = false;
  }

  bar(){
    this.lines = false;
    this.bars = true;
  }

}
