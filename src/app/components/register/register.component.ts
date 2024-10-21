import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);
  storage = inject(Storage);

  username: string = '';
  email: string = '';
  password: string = '';
  profilePicture: File | null = null;
  errorMessage: string = '';

  async onSubmit(form: NgForm): Promise<void> {
    if (form.valid) {
      try {
        const userCredential = await this.authService.register(
          this.username,
          this.email,
          this.password
        );

        const uid = userCredential.user.uid;

        if (this.profilePicture) {
          const filePath = `profile_pictures/${uid}`;
          const storageRef = ref(this.storage, filePath);

          await uploadBytes(storageRef, this.profilePicture);

          const photoURL = await getDownloadURL(storageRef);

          await this.authService.updateUserProfilePicture(uid, photoURL);
        }

        this.router.navigateByUrl('chatapp');
      } catch (error) {
        if (error instanceof Error) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'An unknown error occurred';
        }
      }
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.profilePicture = fileInput.files[0];
    }
  }
}
