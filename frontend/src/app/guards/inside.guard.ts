import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const insideGuard: CanActivateFn = (route, state) => {

  const auth = inject(UserService);
  const router = inject(Router);

  if(auth.isLogged() && !auth.getLogging()){
    router.navigateByUrl('/home');
    return false;
  }
  else if(auth.getLogging()){
    auth.logout();
  }
  return true;
};
