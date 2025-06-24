import { Routes } from '@angular/router';
import { AppLayout } from './app/core/layouts/app.layout';
import { Notfound } from './app/core/pages/notfound/notfound';
import { HomeComponent } from './app/home/pages/home/home.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent, title: 'COFRAP - Accueil' }
        ]
    },
    { path: 'auth', loadChildren: () => import('./app/auth/auth.routes') },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
