import { Chat } from './chat.interface';

export interface AppUser {
  username: string;
  uid: string;
  email: string;
  password: string;
  photoURL: string;
  chats: Chat[];
}
