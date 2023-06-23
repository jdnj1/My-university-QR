import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public formSubmit = false;

  public loginForm = this.fb.group({
    email: ['hla', [Validators.required, Validators.email]],
    password: ['1234', Validators.required ]
  });

  constructor(
    private fb: FormBuilder
  ){}

  login(){
    this.formSubmit = true;
    // Si el formulario no se ha rellenado correctamente no se realiza el login
    if (!this.loginForm.valid) {
      return;
    }




  }

  campoValido(campo: string){
    return this.loginForm.get(campo)?.valid || !this.formSubmit;
  }

}
