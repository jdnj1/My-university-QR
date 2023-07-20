import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/utils/alert/alert.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnDestroy {
  public formSubmit = false;

  // Booleano para comprobar si han habido cambios en el formulario
  hasChanges: Boolean = false;

  formSubscription: any;

  // Formulario para crear nuevos usuarios
  public userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required ],
    lim_consult: [10],
    role: [0]
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService

  ){
    // Nos suscribimos a los cambios que pueda tener el fomrmulario
    this.formSubscription = this.userForm.valueChanges.subscribe(newValue => {
      this.hasChanges = true;
    });
  }

  ngOnDestroy(): void {
    // Liberar recursos
    this.formSubscription.unsubscribe();
  }

  createUser(){
    this.formSubmit = true;

    // Si el formulario no se ha rellenado correctamente no se crea el usuario
    if (!this.userForm.valid) {
      return;
    }

    let role = this.userForm.get('role')?.value;
    if(!role){
      this.userForm.get('role')?.setValue(0);
    }
    else{
      this.userForm.get('role')?.setValue(1);
    }

    console.log(this.userForm.value);

    this.userService.createUser(this.userForm.value).subscribe({
      next: (res: any) => {
        console.log(res);

        // Se redirige a la página principal
        this.router.navigateByUrl('/users-list');
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error('Error al crear al nuevo usuario');
      }
    });
  }

  campoValido(campo: string){
    return this.userForm.get(campo)?.valid || !this.formSubmit;
  }

  cancel(){
    this.router.navigateByUrl('users-list');
  }

}
