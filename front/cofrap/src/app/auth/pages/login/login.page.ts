import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LoginPasswordComponent } from '../../components/login-password/login-password.component';
import { LoginOtpComponent } from '../../components/login-otp/login-otp.component';
import { AppFloatingConfigurator } from '../../../core/components/app.floatingconfigurator';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-login',
    imports: [LoginPasswordComponent, AppFloatingConfigurator, LoginOtpComponent, ToastModule],
    templateUrl: './login.page.html',
    providers: [MessageService],
    styleUrl: './login.page.scss'
})
export class LoginPage {
    public username: string = '';
    public passwordVerified: boolean = false;
    public showOtpVerifiedStep = false;
    public otpVerified: boolean = false;

    public onPasswordVerified(event: { username: string }) {
        this.username = event.username;
        this.passwordVerified = true;
        this.showOtpVerifiedStep = true;
    }

    public onOtpVerified() {
        this.otpVerified = true;
    }
}
