import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(UserService);
  const router = inject(Router);

  if(auth.userIsLoggedIn()){
    return true
  }
  else{
    // Si el usuario no está logueado se le devuleve a la página de login
    router.navigateByUrl('');
    return false;
  }
};
