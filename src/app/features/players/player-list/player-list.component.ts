import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { PlayerService } from '../../../core/services/player.service';
import { Player } from '../../../core/models';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './player-list.component.html'
})
export class PlayerListComponent implements OnInit {
  players:      Player[] = [];
  loading       = true;
  predictingId: number | null = null;

  radarOptions: ChartOptions<'radar'> = {
    responsive: true,
    scales: {
      r: {
        min: 0, max: 100,
        ticks: { stepSize: 25, font: { size: 9 } }
      }
    },
    plugins: { legend: { display: false } }
  };

  constructor(private ps: PlayerService) {}

  ngOnInit() { this.load(); }

  load() {
    this.ps.getAll().subscribe({
      next:  (p: Player[]) => { this.players = p; this.loading = false; },
      error: ()            => { this.loading = false; }
    });
  }

  radarData(p: Player): ChartData<'radar'> {
    return {
      labels: [
        'Speed','Stamina','Strength','Passing',
        'Dribbling','Vision','Shooting','Defending'
      ],
      datasets: [{
        data: [
          p.speed, p.stamina, p.strength, p.passing,
          p.dribbling, p.vision, p.shooting, p.defending
        ],
        backgroundColor:      'rgba(46,134,171,0.2)',
        borderColor:          '#2e86ab',
        pointBackgroundColor: '#2e86ab',
        borderWidth: 2
      }]
    };
  }

  predict(player: Player) {
    this.predictingId = player.id;
    this.ps.predict(player.id).subscribe({
      next: (pred: any) => {
        player.position    = pred.predictedPosition;
        player.predictions = [pred, ...player.predictions];
        this.predictingId  = null;
      },
      error: () => { this.predictingId = null; }
    });
  }

  deletePlayer(id: number) {
    if (!confirm('Delete this player?')) return;
    this.ps.delete(id).subscribe(() => {
      this.players = this.players.filter(p => p.id !== id);
    });
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