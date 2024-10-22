import { Component, inject, OnInit } from '@angular/core';
import { LogoutButtonComponent } from '../logout-button/logout-button.component';
import { AuthService } from '../../services/auth.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { ChatAppService } from '../../services/chat-app.service';
import { AppUser } from '../../interfaces/user.interface';
import { NgTemplateOutlet } from '@angular/common';
import { Message } from '../../interfaces/message.interface';
import { Timestamp } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-app',
  standalone: true,
  imports: [LogoutButtonComponent, NgTemplateOutlet, FormsModule],
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
  newMessage: string = '';

  async ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      const uid = this.auth.currentUser?.uid;
      if (user) {
        this.user = await this.chatAppService.getUserData(uid);
        this.allUsers = (await this.chatAppService.getAllUsersData()).filter(
          (user) => user.uid !== this.user?.uid
        );
        this.photoURL = this.user?.photoURL || null;

        const storedUser = localStorage.getItem('selectedUser');
        if (storedUser) {
          this.selectedUser = JSON.parse(storedUser);
        }
      }
    });
  }

  openChat(user: AppUser): void {
    this.selectedUser = user;
    localStorage.setItem('selectedUser', JSON.stringify(this.selectedUser));
  }

  get usernameOfCurrentlyOpenChat(): string {
    const selectedUser = JSON.parse(
      localStorage.getItem('selectedUser') || '{}'
    );
    return selectedUser.username || '';
  }

  async sendMessage() {
    if (this.newMessage.trim() && this.selectedUser) {
      const message: Message = {
        text: this.newMessage,
        senderUid: this.user?.uid || '',
        date: Timestamp.now(),
        id: Math.random(),
      };

      const chatId = `chat_with_${this.selectedUser.username}-${this.selectedUser.uid}`;

      await this.chatAppService.updateChatMessages(chatId, message);
      this.newMessage = '';
    }
  }
}
