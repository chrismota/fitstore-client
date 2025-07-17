import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeProfilePictureComponent } from './change-profile-picture.component';

describe('ChangeProfilePictureComponent', () => {
  let component: ChangeProfilePictureComponent;
  let fixture: ComponentFixture<ChangeProfilePictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeProfilePictureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeProfilePictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
