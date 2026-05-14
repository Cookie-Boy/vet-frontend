// types/health.ts
export interface VitalsReading {
  timestamp: string; // ISO date
  petId: string;
  heartRate: number;
  respiratoryRate: number;
  temperature: number;
  distanceFromHome?: number;
  activityLevel?: number; // 0-100
  location?: {
    lat: number;
    lon: number;
  };
}

export interface AnalyzedVitals extends VitalsReading {
  isAnomalous: boolean;
  anomalyReason?: string;
}

export interface HealthStats {
  avgHeartRate: number;
  avgRespiratoryRate: number;
  avgTemperature: number;
  anomalyCount: number;
  totalReadings: number;
}

export interface HealthRecommendation {
  petId: string;
  generatedAt: string;
  period: string; // "week", "month"
  summary: string;
  recommendations: string[];
  stats: HealthStats;
}