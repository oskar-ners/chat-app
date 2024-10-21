import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-button',
  standalone: true,
  imports: [],
  template: `<button (click)="logout()">Logout</button>`,
  styles: `
  button {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    &:hover {
        background-color: rgba(255, 255, 255, 0.2);
        transform: scale(1.05);
    }
  }`,
})
export class LogoutButtonComponent {
  authService = inject(AuthService);
  router = inject(Router);

  async logout(): Promise<void> {
    await this.authService.signOut();
    this.router.navigateByUrl('/login');
  }
}
