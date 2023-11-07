import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit, OnDestroy {
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
    private alertService: AlertService,
    private translateService: TranslateService

  ){
    // Nos suscribimos a los cambios que pueda tener el fomrmulario
    this.formSubscription = this.userForm.valueChanges.subscribe(newValue => {
      this.hasChanges = true;
    });
  }

  ngOnInit(): void {
    console.log(this.hasChanges)
    //this.checkExit();
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
    this.userForm.get('role')?.setValue(Number(role) || 0);

    console.log(this.userForm.value);

    this.userService.createUser(this.userForm.value).subscribe({
      next: (res: any) => {
        console.log(res);

        this.hasChanges = false;
        // Se redirige a la página principal
        this.router.navigateByUrl('/users-list');
      },
      error: (err: HttpErrorResponse) => {
        if(err.error.msg === 'El email ya existe'){
          this.alertService.error(this.translateService.instant('user.create.error'));
          return;
        }
        this.alertService.error(this.translateService.instant('alert.user.create.error'));
        console.log(err)
      }
    });
  }

  campoValido(campo: string){
    return this.userForm.get(campo)?.valid || !this.formSubmit;
  }

  cancel(){
    this.router.navigateByUrl('users-list');
  }

  async checkExit(){
    let res = true;
    if(this.hasChanges){
      await Swal.fire({
        icon: "warning",
        title: this.translateService.instant('change.modal.title'),
        text: this.translateService.instant('change.modal.text'),
        showCancelButton: true,
        cancelButtonText: this.translateService.instant('button.cancel'),
        confirmButtonText: this.translateService.instant('button.confirm'),
        confirmButtonColor: '#198754',
        reverseButtons: true
      }).then((result) => {
        if(result.isConfirmed){
          res = true;
        }
        else{
          res = false;
        }
      })
    }

    return res;
  }

}
