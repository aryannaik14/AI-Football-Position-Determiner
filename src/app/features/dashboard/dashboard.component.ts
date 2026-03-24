import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlayerService } from '../../core/services/player.service';
import { AuthService }   from '../../core/services/auth.service';
import { Player, Prediction } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  players:           Player[]     = [];
  recentPredictions: Prediction[] = [];
  loading = true;

  constructor(
    public  auth: AuthService,
    private ps:   PlayerService
  ) {}

  ngOnInit() {
    this.ps.getAll().subscribe({
      next: (players) => {
        this.players = players;
        this.recentPredictions = players
          .flatMap(p => p.predictions)
          .sort((a, b) =>
            new Date(b.predictionDate).getTime() -
            new Date(a.predictionDate).getTime())
          .slice(0, 5);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  get totalPredictions() {
    return this.players.reduce((s, p) => s + p.predictions.length, 0);
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