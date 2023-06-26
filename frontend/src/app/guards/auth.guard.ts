import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { catchError, map, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(UserService);
  const router = inject(Router);

  return auth.validateToken().pipe(
    tap((res: any) => {
      if(!res){
        router.navigateByUrl('');
      }
    })
  );
};
