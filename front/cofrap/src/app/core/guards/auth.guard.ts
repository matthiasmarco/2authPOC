import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Check if the user is logged in
    if (!authService.isUserLoggedIn()) {
        // If not logged in, redirect to the login page
        router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
    return true;
};
