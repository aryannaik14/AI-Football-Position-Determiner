import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../../core/services/player.service';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './player-form.component.html'
})
export class PlayerFormComponent {
  form: FormGroup;
  loading = false;
  error   = '';

  attrs = [
    { key: 'speed',     label: 'Speed',     icon: '⚡', desc: 'Pace & acceleration' },
    { key: 'stamina',   label: 'Stamina',   icon: '🔋', desc: 'Endurance over 90 min' },
    { key: 'strength',  label: 'Strength',  icon: '💪', desc: 'Physical power' },
    { key: 'passing',   label: 'Passing',   icon: '🎯', desc: 'Short & long passing' },
    { key: 'dribbling', label: 'Dribbling', icon: '⚽', desc: 'Ball control' },
    { key: 'vision',    label: 'Vision',    icon: '👁️',  desc: 'Awareness & creativity' },
    { key: 'shooting',  label: 'Shooting',  icon: '🥅', desc: 'Finishing ability' },
    { key: 'defending', label: 'Defending', icon: '🛡️', desc: 'Tackling & positioning' },
  ];

  constructor(
    private fb:     FormBuilder,
    private ps:     PlayerService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name:      ['', Validators.required],
      age:       [22,  [Validators.required, Validators.min(15), Validators.max(45)]],
      height:    [178, [Validators.required, Validators.min(150), Validators.max(220)]],
      weight:    [75,  [Validators.required, Validators.min(50),  Validators.max(120)]],
      speed:     [70,  [Validators.required, Validators.min(1), Validators.max(100)]],
      stamina:   [70,  [Validators.required, Validators.min(1), Validators.max(100)]],
      strength:  [70,  [Validators.required, Validators.min(1), Validators.max(100)]],
      passing:   [70,  [Validators.required, Validators.min(1), Validators.max(100)]],
      dribbling: [70,  [Validators.required, Validators.min(1), Validators.max(100)]],
      vision:    [70,  [Validators.required, Validators.min(1), Validators.max(100)]],
      shooting:  [70,  [Validators.required, Validators.min(1), Validators.max(100)]],
      defending: [70,  [Validators.required, Validators.min(1), Validators.max(100)]],
    });
  }

  val(key: string): number {
    return this.form.get(key)?.value ?? 0;
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error   = '';
    this.ps.create(this.form.value).subscribe({
      next:  () => this.router.navigate(['/players']),
      error: () => {
        this.error   = 'Failed to save player.';
        this.loading = false;
      }
    });
  }
}