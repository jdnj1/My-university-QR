import { CanDeactivateFn } from '@angular/router';

export const changesGuard: CanDeactivateFn<any> = (component: any, currentRoute, currentState, nextState) => {
  return component.checkExit();
};
