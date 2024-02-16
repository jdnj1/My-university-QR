import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/utils/alert/alert.service';
import { environment } from '../../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit, OnDestroy {
  public formSubmit = false;

  // Variable para almacenar los datos del usuario a editar
  user: any;
  idUser =  this.route.snapshot.params['id'];
  emailUser: string = 'Email del usuario';

  // Booleano para comprobar si se realizan cambios en el formulario
  hasChanges: boolean = false;

  // Booleano para comprobar si hay algun error en la contraseña
  passError: boolean = false;


  // Formulario para crear nuevos usuarios
  public userForm = this.fb.group({
    email: [''],
    password: [''],
    lim_consult:[''],
    role: [0]
  });

  // Suscripción para detectar cualquier cambio en el formulario.
  formSubscription: any;

  roles = environment.roles;

  constructor(
    private fb: UntypedFormBuilder,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private translateService: TranslateService

  ){

  }

  ngOnInit(): void {
    this.getUserById();
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }

  getUserById(){
    this.userService.getUserById(this.idUser).subscribe({
      next: (res: any) => {
        this.user = res.user;
        this.emailUser = this.user.email;

        this.userForm.get('email')?.setValue(this.user.email);
        this.userForm.get('lim_consult')?.setValue(this.user.lim_consult);
        this.userForm.get('role')?.setValue(this.user.role);

        // Nos suscribimos a los cambios que pueda tener el fomrmulario
        this.formSubscription = this.userForm.valueChanges.subscribe(newValue => {
          this.hasChanges = true;
        });

      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error(this.translateService.instant('alert.user.update.error'))
      }
    });
  }

  updateUser(){
    this.formSubmit = true;

    // Si el formulario no se ha rellenado correctamente no se actualiza el usuario
    if (!this.userForm.valid) {
      return;
    }

    let role = this.userForm.get('role')?.value;
    this.userForm.get('role')?.setValue(Number(role) || 0);

    if(!this.userForm.get('email')?.dirty){
      this.userForm.removeControl('email');
    }

    this.userService.updateUser(this.userForm.value, this.user.idUser).subscribe({
      next: (res: any) => {
        this.passError = false;

        this.hasChanges = false;
        this.userService.getUserData();
        // Se redirige a la página principal
        this.router.navigateByUrl('/users-list');
      },
      error: (err: HttpErrorResponse) => {
        if(err.error.msg === 'El email ya existe'){
          this.alertService.error(this.translateService.instant('user.create.error'));
          return;
        }
        else if(err.error.msg === 'La contraseña de debe tener minimo 8 caracteres, 2 dígitos, tener al menos una mayúscula y minúscula y no debe tener espacios'){
          this.passError = true;
          this.alertService.error(this.translateService.instant('user.checkpass.error'));
          return;
        }
        this.alertService.error(this.translateService.instant('alert.user.update.error'));
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
