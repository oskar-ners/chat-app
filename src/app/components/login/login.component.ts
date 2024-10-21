import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  async onSubmit(form: NgForm): Promise<void> {
    if (form.valid) {
      await this.authService.login(this.email, this.password).catch((error) => {
        this.errorMessage = error.message;
        throw error;
      });
      this.router.navigateByUrl('chatapp');
    }
  }
}
