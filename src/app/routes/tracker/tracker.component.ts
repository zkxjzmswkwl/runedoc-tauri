import { ChangeDetectorRef, Component, effect, inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { queuePacket } from '../../icp-events/events';
import { MetricSnapshot } from '../../models/metricsnapshot';
import { StateManager } from '../../statemanager';
import { SkillsService } from '../../services/skills.service';

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.css'
})
export class TrackerComponent implements OnInit, OnDestroy {
  private interval: any;
  @ViewChild('chart') chart: any;
  stateManager: StateManager = StateManager.getInstance();
  data: any;
  options: any;
  platformId = inject(PLATFORM_ID);
  metricSnapshots: MetricSnapshot[] = [];

  constructor(private cd: ChangeDetectorRef, private skills: SkillsService) { }

  themeEffect = effect(() => {
    this.initChart();
    this.cd.markForCheck();
  });

  ngOnInit() {
    this.initChart();
    this.interval = setInterval(() => {
      queuePacket("req", "metrics");
      this.updateChartData();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  updateChartData() {
    this.metricSnapshots = this.stateManager.getSkillData().snapshots;

    this.metricSnapshots.forEach((snapshot) => {
      if (snapshot.hourly.some(value => value !== 0)) {
        const datasetIndex = this.data.datasets.findIndex(
          (dataset: any) => dataset.label === this.skills.convertSkillToFormattedString(snapshot.skillId)
        );

        if (datasetIndex !== -1) {
          const dataset = this.data.datasets[datasetIndex];

          dataset.data.push(snapshot.hourly[snapshot.hourly.length - 1]);
          if (dataset.data.length > 50) {
            dataset.data.shift();
          }
        } else {
          this.data.datasets.push({
            label: this.skills.convertSkillToFormattedString(snapshot.skillId),
            fill: false,
            borderColor: this.skills.getColorForSkill(snapshot.skillId),
            yAxisID: 'y',
            tension: 0.4,
            data: snapshot.hourly.slice(-50),
          });
        }
      }
    });

    const longestDataset = this.data.datasets.reduce((a: any, b: any) => (a.data.length > b.data.length ? a : b), { data: [] });
    this.data.labels = longestDataset.data.map((_: any, index: number) => `Second ${index + 1}`);

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
      snapshot.hourly.some(value => value !== 0)
    );

    const labels = filteredSnapshots[0]?.hourly.map((_, index) => index + 1) || [];

    const datasets = filteredSnapshots.map((snapshot) => ({
      label: this.skills.convertSkillToFormattedString(snapshot.skillId),
      fill: false,
      borderColor: this.skills.getColorForSkill(snapshot.skillId),
      yAxisID: 'y',
      tension: 0.4,
      data: snapshot.hourly,
    }));

    this.data = {
      labels: labels,
      datasets: datasets,
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
        duration: 0
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
