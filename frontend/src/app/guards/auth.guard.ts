import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(UserService);
  const router = inject(Router);

  let resp;

  return auth.validateToken().pipe(
    tap((res: any) => {
      if(!res){
        router.navigateByUrl('');
      }
    })
  );



  // if(auth.userIsLoggedIn()){
  //   return true
  // }
  // else{
  //   // Si el usuario no está logueado se le devuleve a la página de login
  //   router.navigateByUrl('');
  //   return false;
  // }
};
