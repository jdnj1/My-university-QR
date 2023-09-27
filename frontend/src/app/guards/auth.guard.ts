import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { catchError, map, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const auth = inject(UserService);
  const router = inject(Router);

  return auth.validateToken().pipe(
    tap((res: any) => {
      if(!res){
        router.navigateByUrl('');
      }

      // Si se intenta acceder a una ruta de admins, se comprueba el rol del usuario
      if(route.data['role'] && route.data['role'] !== auth.role){
        // No lleva a la pagina de login ya que el token del usuario si que es correcto
        router.navigateByUrl('');
      }
    })
  );
};
