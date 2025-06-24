import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Message } from 'primeng/message';
import { ConfirmationService } from 'primeng/api';

import { WelcomeCardComponent } from '../welcome-card/welcome-card.component';
import { AuthService } from '../../services/auth.service';
import { Base64ToImagePipe } from '../../pipes/base64ToImage.pipe';

@Component({
    selector: 'app-register-password',
    standalone: true,
    imports: [ButtonModule, InputTextModule, FormsModule, RouterModule, WelcomeCardComponent, Message, CommonModule, Base64ToImagePipe, ConfirmPopupModule],
    providers: [ConfirmationService],
    templateUrl: './register-password.component.html',
    styleUrl: './register-password.component.scss'
})
export class RegisterPasswordComponent {
    @Input() username: string = '';
    @Input() qrCode: string = '';
    @Output() passwordGenerated = new EventEmitter<{ username: string; qrCode: string }>();
    @Output() mfaConfirmed = new EventEmitter<void>();

    public message: [{ severity: string; text: string }] | null = null;
    public loading = false;
    public showMfaStep = false;

    constructor(private authService: AuthService, private confirmationService: ConfirmationService) {}

    private validateUsername() {
        if (!this.username) {
            this.message = [{ severity: 'warn', text: "Le nom d'utilisateur est requis." }];
            return false;
        }
        if (!(this.username.trim().length > 4)) {
            this.message = [{ severity: 'warn', text: "Le nom d'utilisateur doit comporter au moins 5 caractères." }];
            return false;
        }
        return true;
    }

    public generatePassword() {
        if (!this.validateUsername()) {
            return;
        }

        this.loading = true;
        this.authService.generatePassword(this.username)
            .subscribe({
                next: (res) => {
                    this.message = [{ severity: 'success', text: 'Mot de passe généré.' }];

                    this.passwordGenerated.emit({ username: this.username, qrCode: res.password_qrcode });
                    this.qrCode = res.password_qrcode;

                    this.showMfaStep = true;
                    this.loading = false;
                },
                error: (err: HttpErrorResponse) => {
                    this.message = [{ severity: 'error', text: err?.error?.message }];
                    this.loading = false;
                }
            });
    }

    public onConfirmMfaStep(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Vous voulez maintenant passer à l'étape suivante.?`,
            icon: 'pi pi-info-circle',
            rejectButtonProps: {
                label: 'Annuler',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Confirmer',
                severity: 'success',
            },
            accept: () => {
                this.confirmMfaStep();
            }
        });
    }

    public confirmMfaStep() {
        this.mfaConfirmed.emit();
    }
}
