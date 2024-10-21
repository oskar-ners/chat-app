import { Timestamp } from '@angular/fire/firestore';

export interface Message {
  text: string;
  date: Timestamp;
}
