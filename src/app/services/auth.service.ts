import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(Auth);
  firestore = inject(Firestore);

  isLoggedIn = new BehaviorSubject<boolean>(this.checkIfUserLoggedIn());
  isLoggedIn$ = this.isLoggedIn.asObservable();

  checkIfUserLoggedIn() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return isLoggedIn ? JSON.parse(isLoggedIn) : false;
  }

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    try {
      const userData = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const uid = this.auth.currentUser?.uid;
      const userDocRef = doc(this.firestore, `users/${uid}`);
      setDoc(userDocRef, { uid, username, email, password });

      updateProfile(userData.user, {
        displayName: username,
      });

      localStorage.setItem('isLoggedIn', JSON.stringify(true));
      this.isLoggedIn.next(true);

      console.log('New account created! ' + userData.user.email);
    } catch (error) {
      console.warn('Registration failed! Something went wrong!');
      throw error;
    }
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
