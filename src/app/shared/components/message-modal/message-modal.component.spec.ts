import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesssageModalComponent } from './message-modal.component';

describe('MesssageModalComponent', () => {
  let component: MesssageModalComponent;
  let fixture: ComponentFixture<MesssageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesssageModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MesssageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
