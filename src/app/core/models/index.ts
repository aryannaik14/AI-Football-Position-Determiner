export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  expiresAt: string;
}

export interface Player {
  id: number;
  name: string;
  age: number;
  height: number;
  weight: number;
  speed: number;
  stamina: number;
  strength: number;
  passing: number;
  dribbling: number;
  vision: number;
  shooting: number;
  defending: number;
  position: string;
  createdAt: string;
  predictions: Prediction[];
}

export interface Prediction {
  id: number;
  predictedPosition: string;
  confidence: number;
  predictionDate: string;
  playerId?: number;
  playerName?: string;
}

export interface CreatePlayerRequest {
  name: string;
  age: number;
  height: number;
  weight: number;
  speed: number;
  stamina: number;
  strength: number;
  passing: number;
  dribbling: number;
  vision: number;
  shooting: number;
  defending: number;
}