import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfkwardenComponent } from './afkwarden.component';

describe('AfkwardenComponent', () => {
  let component: AfkwardenComponent;
  let fixture: ComponentFixture<AfkwardenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfkwardenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfkwardenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
