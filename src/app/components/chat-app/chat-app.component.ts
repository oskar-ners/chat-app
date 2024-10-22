import { Component, inject, OnInit } from '@angular/core';
import { LogoutButtonComponent } from '../logout-button/logout-button.component';
import { AuthService } from '../../services/auth.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { ChatAppService } from '../../services/chat-app.service';
import { AppUser } from '../../interfaces/user.interface';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Message } from '../../interfaces/message.interface';

@Component({
  selector: 'app-chat-app',
  standalone: true,
  imports: [LogoutButtonComponent, NgTemplateOutlet, FormsModule, DatePipe],
  templateUrl: './chat-app.component.html',
  styleUrls: ['./chat-app.component.scss'],
})
export class ChatAppComponent implements OnInit {
  authService = inject(AuthService);
  chatAppService = inject(ChatAppService);
  auth = inject(Auth);

  user!: AppUser | null;
  selectedUser!: AppUser | undefined;
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
        await this.chatAppService.updateUserChats();

        const storedUser = localStorage.getItem('selectedUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser?.uid !== this.user?.uid) {
            this.selectedUser = parsedUser;
          } else {
            this.selectedUser = this.allUsers[0];
          }
        } else {
          this.selectedUser = this.allUsers[0];
        }
      }
    });
  }

  openChat(user: AppUser): void {
    if (user.uid !== this.user?.uid) {
      this.selectedUser = user;
      localStorage.setItem('selectedUser', JSON.stringify(this.selectedUser));
    }
  }

  get usernameOfCurrentlyOpenChat(): string {
    return this.selectedUser?.username || '';
  }

  get selectedUserMessages(): Message[] {
    const chatId = `chat_with_${this.selectedUser?.username}-${this.selectedUser?.uid}`;
    return this.user?.chats.find((chat) => chat.id === chatId)?.messages || [];
  }

  async sendMessage() {
    if (this.newMessage.trim() && this.selectedUser) {
      const message: Message = {
        text: this.newMessage,
        senderUsername: this.user?.username || '',
        senderPhoto: this.user?.photoURL || '',
        date: Timestamp.now(),
        id: Math.random(),
      };

      const chatId = `chat_with_${this.selectedUser.username}-${this.selectedUser.uid}`;

      await this.chatAppService.updateChatMessages(
        chatId,
        message,
        this.selectedUser
      );
      this.user = await this.chatAppService.getUserData(this.user?.uid);
      this.newMessage = '';
    }
  }
}
