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
}
