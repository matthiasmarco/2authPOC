import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Message } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { AuthService } from '../../services/auth.service';
import { WelcomeCardComponent } from '../welcome-card/welcome-card.component';
import { Base64ToImagePipe } from '../../pipes/base64ToImage.pipe';

@Component({
    selector: 'app-register-otp',
    standalone: true,
    imports: [ButtonModule, InputTextModule, FormsModule, RouterModule, WelcomeCardComponent, Message, CommonModule, Base64ToImagePipe],
    templateUrl: './register-otp.component.html',
    styleUrl: './register-otp.component.scss'
})
export class RegisterOtpComponent {
    @Input() username!: string;
    @Output() otpGenerated = new EventEmitter<string>();

    public message: { severity: string; text: string } | null = null;
    public loading = false;
    public qrCode: string = '';

    constructor(private authService: AuthService) {}

    public generateOtp() {
        if (!this.username) return;

        this.loading = true;
        this.authService.generateOtp(this.username).subscribe({
            next: (res) => {
                this.message = { severity: 'success', text: 'MFA généré.' };
                this.qrCode = res.mfa_qrcode;
                this.otpGenerated.emit(this.qrCode);

                this.loading = false;
            },
            error: (err: HttpErrorResponse) => {
                this.message = { severity: 'error', text: err?.error.message };
                this.loading = false;
            }
        });
    }
}
