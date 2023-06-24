import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
    private userService: UserService
  ){}

  login(){
    this.formSubmit = true;
    // Si el formulario no se ha rellenado correctamente no se realiza el login
    if (!this.loginForm.valid) {
      return;
    }

    this.userService.login(this.loginForm.value).subscribe(
      res => {
        console.log('Respuesta', res)
      },
      (err) => {
        console.warn('Error respuesta api');
      }
    );




  }

  campoValido(campo: string){
    return this.loginForm.get(campo)?.valid || !this.formSubmit;
  }

}
