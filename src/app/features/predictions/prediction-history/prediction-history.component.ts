import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { PlayerService } from '../../../core/services/player.service';
import { Prediction } from '../../../core/models';

@Component({
  selector: 'app-prediction-history',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './prediction-history.component.html'
})
export class PredictionHistoryComponent implements OnInit {
  predictions: Prediction[] = [];
  loading = true;

  donutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: { legend: { position: 'right' } }
  };

  constructor(private ps: PlayerService) {}

  ngOnInit() {
    this.ps.getHistory().subscribe({
      next:  (p: Prediction[]) => { this.predictions = p; this.loading = false; },
      error: ()                => { this.loading = false; }
    });
  }

  get donutData(): ChartData<'doughnut'> {
    const counts: Record<string, number> = {};
    this.predictions.forEach(p => {
      counts[p.predictedPosition] = (counts[p.predictedPosition] ?? 0) + 1;
    });
    const colors = [
      '#e74c3c','#2980b9','#27ae60',
      '#f39c12','#e67e22','#c0392b'
    ];
    return {
      labels:   Object.keys(counts),
      datasets: [{ data: Object.values(counts), backgroundColor: colors }]
    };
  }

  positionColor(pos: string): string {
    const map: Record<string, string> = {
      Goalkeeper: '#e74c3c', Defender:   '#2980b9',
      Midfielder: '#27ae60', Winger:     '#e67e22',
      Striker:    '#c0392b'
    };
    return map[pos] ?? '#7f8c8d';
  }
}