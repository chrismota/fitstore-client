import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalSectionComponent } from './total-section.component';

describe('TotalSectionComponent', () => {
  let component: TotalSectionComponent;
  let fixture: ComponentFixture<TotalSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
