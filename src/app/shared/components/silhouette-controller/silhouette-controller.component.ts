import { Component, DestroyRef, inject, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { queuePacket } from '../../../icp-events/events';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GlobalService } from '../../services/global.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-silhouette-controller',
  standalone: true,
  imports: [SliderModule, ButtonModule, FormsModule, ReactiveFormsModule],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './silhouette-controller.component.html',
  styleUrl: './silhouette-controller.component.css',
})
export class SilhouetteControllerComponent implements OnInit {
  private readonly globalService = inject(GlobalService);
  private readonly destroyRef = inject(DestroyRef);
  readonly red = new FormControl(1045353216, { nonNullable: true });
  readonly green = new FormControl(1045353216, { nonNullable: true });
  readonly blue = new FormControl(1045353216, { nonNullable: true });

  ngOnInit() {
    this.globalService.silhouette$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(colors => {
        this.red.setValue(colors.red, { emitEvent: false });
        this.green.setValue(colors.green, { emitEvent: false });
        this.blue.setValue(colors.blue, { emitEvent: false });
      });

    this.red.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(red => this.globalService.updateColors({ red }));

    this.green.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(green => this.globalService.updateColors({ green }));

    this.blue.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(blue => this.globalService.updateColors({ blue }));
  }
}
