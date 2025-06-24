import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule],
    providers: [MessageService],
    template: `<router-outlet></router-outlet><p-toast />`
})
export class AppComponent {}
