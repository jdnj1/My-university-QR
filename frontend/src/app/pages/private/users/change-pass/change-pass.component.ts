import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/utils/alert/alert.service';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css']
})
export class ChangePassComponent implements OnDestroy {

  // Datos del usuario
  user = JSON.parse(localStorage.getItem('user') || '');

  public formSubmit = false;

  // Booleano para comprobar si han habido cambios en el formulario
  hasChanges: Boolean = false;

  formSubscription: any;


  public passForm = this.fb.group( {
    oldPassword: [ '' , Validators.required ] ,
    newPassword: [ '' , Validators.required ] ,
    newAgain: [ '' , Validators.required ]
  } );


  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private userService: UserService
  ){
    // Nos suscribimos a los cambios que pueda tener el fomrmulario
    this.formSubscription = this.passForm.valueChanges.subscribe(newValue => {
      this.hasChanges = true;
    });
  }

  ngOnDestroy(): void {
    // Liberar recursos
    this.formSubscription.unsubscribe();
  }

  changePass(){
    this.formSubmit = true;

    // Si el formulario no se ha rellenado correctamente no se crea el usuario
    if (!this.passForm.valid) {
      return;
    }

    //comprobamos primero que la contraseña nueva coincide con el campo de repetir contraseña
    if(this.passForm.get('newPassword')?.value != this.passForm.get('newAgain')?.value){
      this.alertService.error("La contraseña nueva no coincide");
      return;
    }

    this.userService.changePassword(this.user.idUser, this.passForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.alertService.success('Contraseña actualizada');
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.alertService.error(`Error al acutalizar la contraseña: ${err.error.msg}`);
      }
    });
  }

  campoValido(campo: string){
    return this.passForm.get(campo)?.valid || !this.formSubmit;
  }

  cancel(){

  }
}
