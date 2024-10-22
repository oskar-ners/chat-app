import { Timestamp } from '@angular/fire/firestore';

export interface Message {
  text: string;
  senderUsername: string;
  senderPhoto: string;
  date: Timestamp;
  id: number;
}
