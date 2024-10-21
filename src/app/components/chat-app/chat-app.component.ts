import { Component } from '@angular/core';
import { LogoutButtonComponent } from "../logout-button/logout-button.component";

@Component({
  selector: 'app-chat-app',
  standalone: true,
  imports: [LogoutButtonComponent],
  templateUrl: './chat-app.component.html',
  styleUrl: './chat-app.component.scss'
})
export class ChatAppComponent {

}
