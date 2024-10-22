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

  async updateUserChats(): Promise<void> {
    const allUsersDocs = await getDocs(collection(this.firestore, 'users'));
    const allUsersData = allUsersDocs.docs.map((doc) => doc.data() as AppUser);

    const chats: { [key: string]: Chat[] } = {};

    for (const user of allUsersData) {
      chats[user.uid] = [];

      for (const otherUser of allUsersData) {
        if (user.uid !== otherUser.uid) {
          chats[user.uid].push({
            id: `chat_with_${otherUser.username}-${otherUser.uid}`,
            messages: [] as Message[],
          });
        }
      }
    }

    for (const user of allUsersData) {
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(userDocRef, { chats: chats[user.uid] });
    }
  }

  async updateChatMessages(chatId: string, newMessage: Message): Promise<void> {
    const currentUserUid = this.auth.currentUser?.uid;
    if (!currentUserUid) return;

    const userDocRef = doc(this.firestore, `users/${currentUserUid}`);

    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();

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

        console.log(`Wiadomość dodana do czatu o ID: ${chatId}`);
      } else {
        console.error('Nie znaleziono czatu o podanym ID');
      }
    } else {
      console.error('Dokument użytkownika nie istnieje');
    }
  }
}
