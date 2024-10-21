import { inject, Injectable } from '@angular/core';
import { collection, doc, getDoc, getDocs } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { AppUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatAppService {
  firestore = inject(Firestore);

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
}
