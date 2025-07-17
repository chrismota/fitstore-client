import { Component, signal } from '@angular/core';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeProfilePictureComponent } from './change-profile-picture/change-profile-picture.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    PersonalInfoComponent,
    ChangePasswordComponent,
    ChangeProfilePictureComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  selected = signal<'INFO' | 'PASSWORD' | 'IMAGE'>('INFO');

  onSelectSetting(selectedStatus: 'INFO' | 'PASSWORD' | 'IMAGE') {
    this.selected.set(selectedStatus);
  }

  isSelected(option: string) {
    return this.selected() === option;
  }
}
