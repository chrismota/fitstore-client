import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dropdown-item',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './dropdown-item.component.html',
  styleUrl: './dropdown-item.component.scss',
})
export class DropdownItemComponent {
  faAngleRight = faAngleRight;

  label = input<string>('');
  dropsideId = input<string>('');
  isActive = input<boolean>(false);
  mouseEnter = output<string>();
  mouseLeave = output<void>();

  onMouseEnter() {
    this.mouseEnter.emit(this.dropsideId());
  }

  onMouseLeave() {
    this.mouseLeave.emit();
  }
}
