import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RegisterPasswordComponent } from '../../components/register-password/register-password.component';
import { RegisterOtpComponent } from '../../components/register-otp/register-otp.component';
import { AppFloatingConfigurator } from '../../../core/components/app.floatingconfigurator';

@Component({
    selector: 'app-register',
    imports: [RegisterPasswordComponent, AppFloatingConfigurator, RegisterOtpComponent],
    templateUrl: './register.page.html',
    styleUrl: './register.page.scss'
})
export class RegisterPage {
    public username: string = '';
    public passwordQRCode: string = '';
    public showOtpStep = false;
    public otpQRCode: string = '';

    public onPasswordGenerated(event: { username: string; qrCode: string }) {
        this.username = event.username;
        this.passwordQRCode = event.qrCode;
    }

    public onConfirmMfa() {
        this.showOtpStep = true;
    }

    public onOtpGenerated(qrCode: string) {
        this.otpQRCode = qrCode;
    }
}
