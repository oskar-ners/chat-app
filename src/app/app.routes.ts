import { Routes } from '@angular/router';
import { ChatAppComponent } from './components/chat-app/chat-app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authLoggedInGuard } from './guards/auth-logged-in.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authLoggedInGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [authLoggedInGuard],
  },
  { path: 'chatapp', component: ChatAppComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
