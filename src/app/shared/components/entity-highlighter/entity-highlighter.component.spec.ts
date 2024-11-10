import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityHighlighterComponent } from './entity-highlighter.component';

describe('EntityHighlighterComponent', () => {
  let component: EntityHighlighterComponent;
  let fixture: ComponentFixture<EntityHighlighterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityHighlighterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityHighlighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
