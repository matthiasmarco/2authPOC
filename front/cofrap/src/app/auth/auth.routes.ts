import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login.page';
import { RegisterPage } from './pages/register/register.page';

export default [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginPage, title: 'COFRAP - Connexion' },
    { path: 'register', component: RegisterPage, title: 'COFRAP - Inscription' },
] as Routes;
