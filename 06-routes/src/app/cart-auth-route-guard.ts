import { Injectable, inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { map } from 'rxjs';
import { ROUTER_TOKENS } from './app.routes';
import { Router } from '@angular/router';

export function authGuard(route: string) {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.userAuth.pipe(
      map((permissions) => !!permissions?.includes(route) || router.parseUrl(`/${ROUTER_TOKENS.NOT_AUTH}`)))
  };
}
