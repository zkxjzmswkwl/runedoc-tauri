import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { queuePacket } from '../../icp-events/events';
import { MetricSnapshot } from '../../models/metricsnapshot';
import { convertSkillToFormattedString, getColorForSkill } from '../../shared/utils/skills';
import { filter, interval, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkillsService } from '../../shared/services/skills.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [ChartModule, AsyncPipe],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.css',
})
export class TrackerComponent implements OnInit {
  private readonly skillsService = inject(SkillsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly datasets$ = this.skillsService.snapshots$
    .pipe(
      map(snapshots => snapshots.filter(s => s.hourly.some(h => h !== 0))),
      map(snapshots => snapshots.map(s => this.snapshotToDataset(s, h => h))),
    );
  readonly labels$ = this.datasets$
    .pipe(
      // ignore empty arrays when reducing.
      filter(d => d.length > 0),
      map(datasets => datasets?.reduce((a, b) => a.data.length > b.data.length ? a : b) ?? []),
      map(datasets => datasets.data.map((_, index) => `Second ${index + 1}`)),
    );

  options: any;

  ngOnInit() {
    this.initChart();
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        queuePacket('req', 'metrics');
      });
  }

  snapshotToDataset(snapshot: MetricSnapshot, hourlyPredicate: (hours: number[]) => number[]) {
    return {
      label: convertSkillToFormattedString(snapshot.skillId),
      fill: false,
      borderColor: getColorForSkill(snapshot.skillId),
      yAxisID: 'y',
      tension: 0.4,
      data: hourlyPredicate(snapshot.hourly),
    };
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
    
    this.options = {
      stacked: false,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      animation: {
        duration: 0,
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
  }
}
