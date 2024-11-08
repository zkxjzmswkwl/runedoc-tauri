import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneObjectDebugComponent } from './scene-object-debug.component';

describe('SceneObjectDebugComponent', () => {
  let component: SceneObjectDebugComponent;
  let fixture: ComponentFixture<SceneObjectDebugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SceneObjectDebugComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SceneObjectDebugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
