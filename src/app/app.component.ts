import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MesssageModalComponent } from './shared/components/message-modal/message-modal.component';
import { MessageModalService } from './core/services/messageModal.service';
import { CartComponent } from './shared/components/cart/cart.component';
import { CartService } from './core/services/cart.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    MesssageModalComponent,
    CartComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private messageModalService = inject(MessageModalService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);

  title = this.messageModalService.title;
  message = this.messageModalService.message;
  type = this.messageModalService.type;

  cartIsVisible = this.cartService.cartIsVisible;

  ngOnInit(): void {
    this.authService.checkSessionExpiration();
  }
}
