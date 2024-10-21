import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  doc,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { AppUser } from '../interfaces/user.interface';
import { Chat } from '../interfaces/chat.interface';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(Auth);
  firestore = inject(Firestore);

  isLoggedIn = new BehaviorSubject<boolean>(this.checkIfUserLoggedIn());
  isLoggedIn$ = this.isLoggedIn.asObservable();

  checkIfUserLoggedIn(): boolean {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return isLoggedIn ? JSON.parse(isLoggedIn) : false;
  }

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<UserCredential> {
    try {
      const userData = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const allUsersDocs = await getDocs(collection(this.firestore, 'users'));
      const allUsersData = allUsersDocs.docs
        .map((doc) => doc.data() as AppUser)
        .filter((user) => user.uid !== this.auth.currentUser?.uid);

      const chats: Chat[] = allUsersData.map((user) => ({
        id: `${user.username}_${user.email}`,
        messages: [] as Message[],
      }));

      const uid = userData.user.uid;
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await setDoc(userDocRef, {
        uid,
        username,
        email,
        password,
        chats: chats,
      });

      localStorage.setItem('isLoggedIn', JSON.stringify(true));
      this.isLoggedIn.next(true);

      console.log('New account created! ' + userData.user.email);
      return userData;
    } catch (error) {
      console.warn('Registration failed! Something went wrong!');
      throw error;
    }
  }

  async updateUserProfilePicture(uid: string, photoURL: string): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    await setDoc(userDocRef, { photoURL }, { merge: true });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userData = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      localStorage.setItem('isLoggedIn', JSON.stringify(true));
      this.isLoggedIn.next(true);

      console.log('Welcome! You signed In! ' + userData.user.email);
    } catch (error) {
      console.warn('Something went wrong when you tried to sign in!');
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);

      localStorage.setItem('isLoggedIn', JSON.stringify(false));
      this.isLoggedIn.next(false);

      console.log('You signed out!');
    } catch {
      console.warn('Something went wrong when you tried to sign out!');
    }
  }
}
