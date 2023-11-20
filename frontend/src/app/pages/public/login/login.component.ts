import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { loginform } from '../../../interfaces/login-form.interface';
import { AlertService } from 'src/app/utils/alert/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public formSubmit = false;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required ],
    remember: [localStorage.getItem('email') || false]
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService
  ){}

  login(){
    this.formSubmit = true;
    // Si el formulario no se ha rellenado correctamente no se realiza el login
    if (!this.loginForm.valid) {
      return;
    }

    this.userService.login(this.loginForm.value).subscribe({
      next: (res: any) => {

        // Se redirige a la página principal
        this.router.navigateByUrl('/home');
      },
      error: (err: HttpErrorResponse) => {
        this.alertService.error('Usuario o contraseña incorrectos.');
      }
    });
  }

  campoValido(campo: string){
    return this.loginForm.get(campo)?.valid || !this.formSubmit;
  }

}
