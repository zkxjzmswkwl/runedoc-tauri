import { Component, DestroyRef, inject, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GlobalService } from '../../services/global.service';
import { ColorPickerModule } from 'primeng/colorpicker';

@Component({
  selector: 'app-silhouette-controller',
  standalone: true,
  imports: [SliderModule, ButtonModule, FormsModule, ReactiveFormsModule, ColorPickerModule],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './silhouette-controller.component.html',
  styleUrl: './silhouette-controller.component.css',
})
export class SilhouetteControllerComponent implements OnInit {
  private readonly globalService = inject(GlobalService);
  private readonly destroyRef = inject(DestroyRef);
  readonly opacity = new FormControl(0, {nonNullable: true });
  readonly width = new FormControl(0, {nonNullable: true });
  readonly color = new FormControl('#000000', {nonNullable: true});

  ngOnInit() {
    this.globalService.silhouette$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(colors => {
        this.color.setValue(this.toHex(colors.red, colors.green, colors.blue), { emitEvent: false });
        this.opacity.setValue(colors.opacity, { emitEvent: false });
        this.width.setValue(colors.width, { emitEvent: false });
      });

    this.opacity.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(opacity => this.globalService.updateColors({ opacity }));

    this.width.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(width => this.globalService.updateColors({ width }));
    
    this.color.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(color => this.globalService.updateColors(this.fromHex(color)));
  }

  private fromHex(hex: string) : { red: number, green: number, blue: number } {
    const red = parseInt(hex.substring(1, 3), 16) / 255;
    const green = parseInt(hex.substring(3, 5), 16) / 255;
    const blue = parseInt(hex.substring(5, 7), 16) / 255;
    return { red, green, blue };
  }

  private toHex(red: number, green: number, blue: number) : string {
    const r = Math.round(red * 255).toString(16).padStart(2, '0');
    const g = Math.round(green * 255).toString(16).padStart(2, '0');
    const b = Math.round(blue * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
}
