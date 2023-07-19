import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/utils/alert/alert.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit{
  public formSubmit = false;

  // Variable para almacenar los datos del usuario a editar
  user: any;
  idUser =  this.route.snapshot.params['id'];
  emailUser: string = 'Email del usuario';

  // Formulario para crear nuevos usuarios
  public userForm = this.fb.group({
    email: [''],
    password: [''],
    lim_consult:[''],
    role: [0]
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private renderer: Renderer2

  ){

  }

  ngOnInit(): void {
    this.getUserById();

  }

  getUserById(){
    this.userService.getUserById(this.idUser).subscribe({
      next: (res: any) => {
        console.log(res)
        this.user = res.user;
        this.emailUser = this.user.email;

        this.userForm.get('lim_consult')?.setValue(this.user.lim_consult);
        this.userForm.get('role')?.setValue(this.user.role);

      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.alertService.error('Error al intentar actualizar el usuario')
      }
    });
  }

  updateUser(){
    this.formSubmit = true;

    let role = this.userForm.get('role')?.value;
    if(!role){
      this.userForm.get('role')?.setValue(0);
    }
    else{
      this.userForm.get('role')?.setValue(1);
    }

    this.userService.updateUser(this.userForm.value, this.user.idUser).subscribe({
      next: (res: any) => {
        console.log(res);

        // Se redirige a la página principal
        this.router.navigateByUrl('/users-list');
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        this.alertService.error('Error al actualizar al usuario');
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
