import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faRightToBracket,
  faRightFromBracket,
  faUser,
  faHouse,
  faFile,
  faUserPlus,
  faSearch,
  faPhone,
  faDumbbell,
  faCreditCardAlt,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { DropdownComponent } from '../footer/dropdown/dropdown.component';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../core/services/customer.service';
import { MessageModalService } from '../../core/services/messageModal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, FontAwesomeModule, DropdownComponent, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private customerService = inject(CustomerService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private messageModalService = inject(MessageModalService);

  faRightToBracket = faRightToBracket;
  faRightFromBracket = faRightFromBracket;
  faHouse = faHouse;
  faFile = faFile;
  faUserPlus = faUserPlus;
  faSearch = faSearch;
  faPhone = faPhone;
  faDumbbell = faDumbbell;
  faUser = faUser;
  faCreditCardAlt = faCreditCardAlt;
  faShoppingCart = faShoppingCart;

  searchQuery = signal<string>('');

  isDropdownOpen = false;

  cart = this.cartService.cart;
  userIsAuthenticated = this.authService.userIsAuthenticated;
  imageServerPath = this.customerService.imageServerPath;
  customer = this.customerService.customer;

  cartIsEmpty = computed<boolean>(() => {
    return this.cart().length === 0;
  });

  onToggleVisibility(): void {
    this.cartService.toggleVisibility();
  }

  onLogout(): void {
    this.authService.logout();
    this.messageModalService.buildSuccessMessage('Você foi deslogado.');
  }

  onSubmit(): void {
    if (this.searchQuery().trim()) {
      if (this.searchQuery().length < 3) {
        this.messageModalService.buildErrorMessage(
          'A pesquisa deve ter pelo menos 3 caracteres.',
        );
        return;
      }

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/search'], {
          queryParams: { name: this.searchQuery() },
        });
      });
    }
  }

  onToggleDropdownOn(): void {
    this.isDropdownOpen = true;
  }

  onToggleDropdownOff(): void {
    this.isDropdownOpen = false;
  }
}
