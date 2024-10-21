import { Component, inject, OnInit } from '@angular/core';
import { LogoutButtonComponent } from '../logout-button/logout-button.component';
import { AuthService } from '../../services/auth.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { ChatAppService } from '../../services/chat-app.service';
import { AppUser } from '../../interfaces/user.interface';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-chat-app',
  standalone: true,
  imports: [LogoutButtonComponent, NgTemplateOutlet],
  templateUrl: './chat-app.component.html',
  styleUrl: './chat-app.component.scss',
})
export class ChatAppComponent implements OnInit {
  authService = inject(AuthService);
  chatAppService = inject(ChatAppService);

  auth = inject(Auth);

  user!: AppUser | null;
  selectedUser!: AppUser;
  allUsers: AppUser[] = [];
  photoURL: string | null = null;

  async ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      const uid = this.auth.currentUser?.uid;
      if (user) {
        this.user = await this.chatAppService.getUserData(uid);
        this.allUsers = (await this.chatAppService.getAllUsersData()).filter(
          (user) => user.uid !== this.user?.uid
        );
        this.photoURL = this.user?.photoURL || null;
        this.chatAppService.updateUserChats();
      }
    });
  }

  openChat(user: AppUser): void {
    this.selectedUser = user;
    localStorage.setItem('selectedUser', this.selectedUser.username);
  }

  get usernameOfCurrentlyOpenChat(): string {
    return localStorage.getItem('selectedUser') || '';
  }
}
