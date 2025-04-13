export interface SearchParams {
  rent_budget: number;
  job_title: string;
  rent_weight?: number;
  job_weight?: number;
  budget_threshold?: number;
}

export interface LocationRecommendation {
  city: string;
  state: string;
  avg_rent: number;
  job_count: number;
  score: number;
  score_percentage: string;
  reason: string;
} 