import { Timestamp } from '@angular/fire/firestore';

export interface Message {
  text: string;
  senderUid: string;
  date: Timestamp;
  id: number;
}
