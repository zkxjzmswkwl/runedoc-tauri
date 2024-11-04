import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { queuePacket } from '../../icp-events/events';
import { MetricSnapshot } from '../../models/metricsnapshot';
import { StateManager } from '../../statemanager';
import { convertSkillToFormattedString, getColorForSkill } from '../../shared/utils/skills';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.css',
})
export class TrackerComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly ref = inject(ChangeDetectorRef);

  @ViewChild('chart') chart: any;
  readonly stateManager = StateManager.getInstance();
  data: any;
  options: any;
  platformId = inject(PLATFORM_ID);
  metricSnapshots: MetricSnapshot[] = [];

  themeEffect = effect(() => {
    this.initChart();
    this.ref.markForCheck();
  });

  ngOnInit() {
    this.initChart();

    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        queuePacket('req', 'metrics');
        this.updateChartData();
      });
  }

  updateChartData() {
    this.metricSnapshots.length = 0;
    this.metricSnapshots = this.stateManager.getSkillData().snapshots
    // this.metricSnapshots.concat([...this.stateManager.getSkillData().snapshots]);
    
    console.log(this.metricSnapshots);

    for (const snapshot of this.metricSnapshots) {
      if (snapshot.hourly.some(value => value !== 0)) {
        const datasetIndex = this.data.datasets.findIndex(
          (dataset: any) => dataset.label === convertSkillToFormattedString(snapshot.skillId),
        );

        if (datasetIndex !== -1) {
          const dataset = this.data.datasets[datasetIndex];

          dataset.data.push(snapshot.hourly[snapshot.hourly.length - 1]);
          if (dataset.data.length > 50) {
            dataset.data.shift();
          }
        } else {
          this.data.datasets.push({
            label: convertSkillToFormattedString(snapshot.skillId),
            fill: false,
            borderColor: getColorForSkill(snapshot.skillId),
            yAxisID: 'y',
            tension: 0.4,
            data: snapshot.hourly.slice(-50),
          });
        }
      }
    }

    const longestDataset = this.data.datasets.reduce((a: any, b: any) => (a.data.length > b.data.length ? a : b), { data: [] });
    this.data.labels = longestDataset.data.map((_: any, index: number) => `Second ${index + 1}`);
    
    console.log(this.data);

    if (this.chart && this.chart.chart) {
      this.chart.chart.update();
    }
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    const filteredSnapshots = this.metricSnapshots.filter(snapshot =>
      snapshot.hourly.some(value => value !== 0),
    );

    const labels = filteredSnapshots[0]?.hourly.map((_, index) => index + 1) || [];

    const datasets = filteredSnapshots.map((snapshot) => ({
      label: convertSkillToFormattedString(snapshot.skillId),
      fill: false,
      borderColor: getColorForSkill(snapshot.skillId),
      yAxisID: 'y',
      tension: 0.4,
      data: snapshot.hourly,
    }));

    this.data = {
      labels,
      datasets,
    };

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
