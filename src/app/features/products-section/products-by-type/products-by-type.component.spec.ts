import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsByTypeComponent } from './products-by-type.component';

describe('ProductsTypeListComponent', () => {
  let component: ProductsByTypeComponent;
  let fixture: ComponentFixture<ProductsByTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsByTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsByTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
