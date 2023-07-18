import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/utils/alert/alert.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  public formSubmit = false;

  // Formulario para crear nuevos usuarios
  public userForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required ],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService

  ){

  }

  createUser(){
    this.formSubmit = true;

    // Si el formulario no se ha rellenado correctamente no se crea el usuario
    if (!this.userForm.valid) {
      return;
    }

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

}
