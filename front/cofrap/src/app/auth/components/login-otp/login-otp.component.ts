import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { Message } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

import { WelcomeCardComponent } from '../welcome-card/welcome-card.component';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-login-otp',
    standalone: true,
    imports: [ButtonModule, FormsModule, RouterModule, InputOtpModule, CommonModule, WelcomeCardComponent, Message, ToastModule],
    providers: [MessageService],
    templateUrl: './login-otp.component.html',
    styleUrl: './login-otp.component.scss'
})
export class LoginOtpComponent {
    @Input() username: string = '';
    @Output() otpVerified = new EventEmitter();

    otpValue: string = '';

    public message: [{ severity: string; text: string }] | null = null;

    public loading = false;

    constructor(
        private router: Router,
        private authService: AuthService,
        private messageService: MessageService
    ) {}

    public onVerifyOtp() {
        if (!this.otpValue) {
            this.message = [{ severity: 'warn', text: 'Le code OTP est requis.' }];
            return;
        }

        this.loading = true;
        this.authService.verifyOtp(this.username, this.otpValue).subscribe({
            next: (res) => {
                this.message = [{ severity: 'success', text: 'Code OTP vérifié avec succès.' }];
                this.otpVerified.emit(); // Emit event to notify parent component
                // Save username to local storage
                this.authService.saveUserToStorage(this.username);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Connexion réussie',
                    detail: 'Bienvenue ' + this.username + ' !',
                    life: 8000 // Optional: duration for the toast message
                });

                this.loading = false;

                setTimeout(() => {
                    this.router.navigate(['/home']); // Redirect to dashboard or home page
                }, 1000); // Optional: delay for better user experience
            },
            error: (err) => {
                this.message = [{ severity: 'error', text: err?.error?.message || 'Erreur lors de la vérification du code OTP.' }];
                this.loading = false;
            }
        });
    }

    public onCancelOtp() {
        this.otpValue = '';
        this.message = null;
        this.router.navigate(['/auth/login']); // Redirect to login page
    }
}
