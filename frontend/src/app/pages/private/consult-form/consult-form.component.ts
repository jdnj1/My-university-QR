import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  // Array donde se almacenan las keys y los filtros juntos
  // entries: any = [];

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
    dateTo: ['', Validators.required]
  });

  // Form de la segunda parte
  secondForm = this.fb.group({
    data: ['1', Validators.required],
  });

  // Form para los filtros
  filterForm: FormGroup = this.fb.group({
  });


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
          dateTo: [this.consult.dateTo]
        });

        // Pasamos los filtros a JSON
        this.consult.filters = JSON.parse(this.consult.filters);
        console.log(this.consult.filters)

        // Pasamos los filtros al array
        this.filtersArray = Object.values(this.consult.filters);
        console.log(this.filtersArray);

        // Pasamos las keys al array
        this.keys = Object.keys(this.consult.filters);
        console.log(this.keys);

        // this.entries = Object.entries(this.consult.filters);

        // Agregamos los filtros al formulario
        for(let i = 0; i < this.filtersArray.length; i ++){
          this.filterForm.addControl(this.keys[i], this.fb.control(this.filtersArray[i]));
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
    // Comprobar que la fecha hasta no sea anterior a la fecha desde
    let dateFrom = this.firstForm.get('dateFrom')?.value;
    let dateTo = this.firstForm!.get('dateTo')?.value;

    if(dateFrom != null && dateFrom != undefined && dateTo != null && dateTo != undefined){
      if(dateFrom >= dateTo){
        this.alertService.error("La fecha 'Hasta' no puede ser anterior a la fecha 'Desde'");
        return;
      }
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
    this.keys.push(this.keys.length+1);

    // Agregamos un nuevo campo al formulario de los filtros
    this.filterForm.addControl(this.keys.length, this.fb.control(''));
    console.log(this.filterForm.value);
  }

  deleteFilter(index: any, key: string){
    this.filtersArray.splice(index, 1);
    this.keys.splice(index, 1);

    this.filterForm.removeControl(key);
    console.log(this.filterForm.value)
  }

  onChange(index: any, key: string){
    console.log(key)
  }

}
