import { Component, inject, signal } from '@angular/core';
import { DropdownItemComponent } from '../dropdown-item/dropdown-item.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DropdownDataService } from './dropdown-data.service';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [FontAwesomeModule, DropdownItemComponent],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent {
  private dropdownDataService = inject(DropdownDataService);
  activeDropside = signal<string | null>(null);

  dropdownItems = this.dropdownDataService.dropdownItems;

  isActiveDropside(id: string): boolean {
    return this.activeDropside() === id;
  }

  onSetActiveDropside(id: string): void {
    this.activeDropside.set(id);
  }

  onClearActiveDropside(): void {
    this.activeDropside.set(null);
  }
}
