import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SilhouetteControllerComponent } from './silhouette-controller.component';

describe('SilhouetteControllerComponent', () => {
  let component: SilhouetteControllerComponent;
  let fixture: ComponentFixture<SilhouetteControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SilhouetteControllerComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(SilhouetteControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
