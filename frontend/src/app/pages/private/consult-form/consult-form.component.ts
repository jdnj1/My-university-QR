import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-consult-form',
  templateUrl: './consult-form.component.html',
  styleUrls: ['./consult-form.component.css']
})
export class ConsultFormComponent {

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

  // Form de la primera parte
  secondForm = this.fb.group({
    data: ['', Validators.required],
  });


  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
  ){

  }

  changeDate(){
    this.date = !this.date;
    console.log(this.date)
  }

  selectData(){
    if(Number(this.secondForm.value.data) > 1){
      this.filters = false;
    }
    else {
      this.filters = true;
    }
  }

}
