import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityHiderComponent } from './entity-hider.component';

describe('EntityHiderComponent', () => {
  let component: EntityHiderComponent;
  let fixture: ComponentFixture<EntityHiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityHiderComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(EntityHiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
