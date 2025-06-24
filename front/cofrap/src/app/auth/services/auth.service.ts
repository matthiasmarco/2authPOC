import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface GeneratePasswordResponse {
    status: string;
    username: string;
    password_qrcode: string;
}

interface GenerateMFAResponse {
    status: string;
    username: string;
    mfa_qrcode: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private httpClient: HttpClient) {}

    public generatePassword(username: string): Observable<GeneratePasswordResponse> {
        return this.httpClient.post<GeneratePasswordResponse>(`function/generate-password`, { username });
    }

    public generateOtp(username: string): Observable<GenerateMFAResponse> {
        return this.httpClient.post<GenerateMFAResponse>(`function/generate-2fa`, { username });
    }

    public verifyPassword(username: string, password: string): Observable<{ status: string }> {
        return this.httpClient.post<{ status: string }>(`function/authenticate-password`, { username, password });
    }

    public verifyOtp(username: string, otp: string): Observable<{ status: string }> {
        return this.httpClient.post<{ status: string }>(`function/authenticate-2fa`, { username, otp });
    }

    public saveUserToStorage(username: string): void {
        localStorage.setItem('username', username);
    }

    public getUsernameFromStorage(): string | null {
        return localStorage.getItem('username');
    }

    public isUserLoggedIn(): boolean {
        return this.getUsernameFromStorage() !== null;
    }

    public clearUserFromStorage(): void {
        localStorage.removeItem('username');
    }
}
