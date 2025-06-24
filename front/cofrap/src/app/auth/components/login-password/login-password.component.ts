import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Message } from 'primeng/message';

import { WelcomeCardComponent } from '../welcome-card/welcome-card.component';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login-password',
    standalone: true,
    imports: [PasswordModule, ButtonModule, InputTextModule, FormsModule, RouterModule, WelcomeCardComponent, Message],
    templateUrl: './login-password.component.html',
    styleUrl: './login-password.component.scss'
})
export class LoginPasswordComponent {
    @Input() username: string = '';
    @Output() passwordVerified = new EventEmitter<{ username: string }>();

    public password: string = '';

    public message: [{ severity: string; text: string }] | null = null;
    public loading = false;

    constructor(private authService: AuthService) {}

    private validateUsername() {
        if (!this.username) {
            this.message = [{ severity: 'warn', text: "Le nom d'utilisateur est requis." }];
            return false;
        }
        if (!(this.username.trim().length > 5)) {
            this.message = [{ severity: 'warn', text: "Le nom d'utilisateur doit comporter au moins 5 caractères." }];
            return false;
        }
        return true;
    }

    public onVerifyPassword() {
        if (!this.validateUsername()) {
            return;
        }

        this.loading = true;
        this.authService.verifyPassword(this.username, this.password).subscribe({
            next: (res) => {
                this.message = [{ severity: 'success', text: 'Mot de passe vérifié.' }];
                this.passwordVerified.emit({ username: this.username });
                this.loading = false;
            },
            error: (err) => {
                this.message = [{ severity: 'error', text: err?.error?.message || 'Erreur lors de la vérification du mot de passe.' }];
                this.loading = false;
            }
        });
    }
}
