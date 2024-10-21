import { Component, inject, OnInit } from '@angular/core';
import { LogoutButtonComponent } from '../logout-button/logout-button.component';
import { AuthService } from '../../services/auth.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-chat-app',
  standalone: true,
  imports: [LogoutButtonComponent],
  templateUrl: './chat-app.component.html',
  styleUrl: './chat-app.component.scss',
})
export class ChatAppComponent implements OnInit {
  authService = inject(AuthService);

  auth = inject(Auth);

  user: any;
  photoURL: string | null = null;

  async ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      const uid = this.auth.currentUser?.uid;
      if (user) {
        this.user = await this.authService.getUserData(uid);
        this.photoURL = this.user?.photoURL || null;
      }
    });
  }
}
