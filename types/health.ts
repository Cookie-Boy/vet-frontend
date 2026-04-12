export interface VitalsData {
  timestamp: string;
  petId: string;
  heartRate: number;
  respiratoryRate: number;
  temperature: number;
  activityLevel?: number;
  location?: {
    lat: number;
    lon: number;
  };
}

export interface AnalyzedVitals extends VitalsData {
  isAnomalous: boolean;
  anomalyReason?: string;
}

export interface HealthRecommendation {
  petId: string;
  generatedAt: string;
  period: string;
  summary: string;
  recommendations: string[];
  stats: {
    avgHeartRate: number;
    avgRespiratoryRate: number;
    anomalyCount: number;
  };
}