import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public formSubmit = false;

  public loginForm = this.fb.group({
    email: ['userpass@gmail.com', [Validators.required, Validators.email]],
    password: ['1234', Validators.required ]
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ){}

  login(){
    this.formSubmit = true;
    // Si el formulario no se ha rellenado correctamente no se realiza el login
    if (!this.loginForm.valid) {
      return;
    }

    this.userService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        // Se almacena el token en el localStorage del navegador
        localStorage.setItem('token', res.token);
        localStorage.setItem('isLoggedIn', 'true');
        // Se redirige a la página principal
        this.router.navigateByUrl('/home');
      },
      error: (err: HttpErrorResponse) => {
        console.warn('Error respuesta api')
      }
    });
  }

  campoValido(campo: string){
    return this.loginForm.get(campo)?.valid || !this.formSubmit;
  }

}
