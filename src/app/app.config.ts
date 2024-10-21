import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"chat-app-2f30c","appId":"1:955038607258:web:c995ac0b8bf1c103b67c23","storageBucket":"chat-app-2f30c.appspot.com","apiKey":"AIzaSyCIG77J0UC1jD_3dNqXYQcqLFDmmn-033k","authDomain":"chat-app-2f30c.firebaseapp.com","messagingSenderId":"955038607258"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
