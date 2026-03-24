import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Player, Prediction, CreatePlayerRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private base = `${environment.apiUrl}/player`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Player[]> {
    return this.http.get<Player[]>(this.base);
  }

  create(data: CreatePlayerRequest): Observable<Player> {
    return this.http.post<Player>(this.base, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  predict(playerId: number): Observable<Prediction> {
    return this.http.post<Prediction>(
      `${this.base}/${playerId}/predict`, {});
  }

  getHistory(): Observable<Prediction[]> {
    return this.http.get<Prediction[]>(`${this.base}/predictions`);
  }
}