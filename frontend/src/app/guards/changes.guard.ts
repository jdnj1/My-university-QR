import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

export const changesGuard: CanDeactivateFn<any> = async (component: any, currentRoute, currentState, nextState) => {
  // return component.checkExit();
  const translateService = inject(TranslateService);

  let res = true;
  if(component.hasChanges){

    await Swal.fire({
      icon: "warning",
      title: translateService.instant('change.modal.title'),
      text: translateService.instant('change.modal.text'),
      showCancelButton: true,
      cancelButtonText: translateService.instant('button.cancel'),
      confirmButtonText: translateService.instant('button.confirm'),
      confirmButtonColor: '#198754',
      reverseButtons: true
    }).then((result) => {
      if(result.isConfirmed){
        res = true;
      }
      else{
        res = false;
      }
    })
  }

  return res;
};
