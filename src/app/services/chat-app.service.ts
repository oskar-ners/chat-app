import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { AppUser } from '../interfaces/user.interface';
import { Chat } from '../interfaces/chat.interface';
import { Message } from '../interfaces/message.interface';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class ChatAppService {
  firestore = inject(Firestore);
  auth = inject(Auth);

  async getUserData(uid: string | undefined): Promise<AppUser | null> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userDoc = await getDoc(userDocRef);
      return userDoc.exists() ? (userDoc.data() as AppUser) : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getAllUsersData(): Promise<AppUser[]> {
    try {
      const usersCollection = collection(this.firestore, 'users');
      const usersDocs = await getDocs(usersCollection);
      return usersDocs.docs.map((doc) => doc.data() as AppUser);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async updateChatMessages(
    chatId: string,
    newMessage: Message,
    selectedUser: AppUser
  ): Promise<void> {
    const currentUserUid = this.auth.currentUser?.uid;
    if (!currentUserUid) return;

    const userDocRef = doc(this.firestore, `users/${currentUserUid}`);
    const recipientUid = selectedUser?.uid;
    const recipientDocRef = doc(this.firestore, `users/${recipientUid}`);

    const userDocSnap = await getDoc(userDocRef);
    const recipientDocSnap = await getDoc(recipientDocRef);

    if (userDocSnap.exists() && recipientDocSnap.exists()) {
      const userData = userDocSnap.data();
      const recipientData = recipientDocSnap.data();

      const chatIndex = userData['chats'].findIndex(
        (chat: Chat) => chat.id === chatId
      );
      if (chatIndex > -1) {
        const updatedChats = [...userData['chats']];
        const updatedMessages = [
          ...updatedChats[chatIndex].messages,
          newMessage,
        ];

        updatedChats[chatIndex].messages = updatedMessages;
        await updateDoc(userDocRef, { chats: updatedChats });
      }

      const recipientChatId = `chat_with_${userData['username']}-${currentUserUid}`;
      const recipientChatIndex = recipientData['chats'].findIndex(
        (chat: Chat) => chat.id === recipientChatId
      );
      if (recipientChatIndex > -1) {
        const recipientUpdatedChats = [...recipientData['chats']];
        const recipientUpdatedMessages = [
          ...recipientUpdatedChats[recipientChatIndex].messages,
          newMessage,
        ];

        recipientUpdatedChats[recipientChatIndex].messages =
          recipientUpdatedMessages;
        await updateDoc(recipientDocRef, { chats: recipientUpdatedChats });

        console.log();
      } else {
        console.error('Nie znaleziono czatu odbiorcy o podanym ID');
      }
    } else {
      console.error('Dokument użytkownika lub odbiorcy nie istnieje');
    }
  }
}
