export type DshRecommendationSeverity = 'critical' | 'high' | 'medium' | 'low';
export type DshRecommendationConfidence = 'high' | 'medium' | 'low';

export type DshUnifiedRecommendation = {
  id: string;
  surface: string;
  severity: DshRecommendationSeverity;
  confidence: DshRecommendationConfidence;
  affectedEntity: string;
  reason: string;
  evidence: string;
  nextAction: string;
  owner: string;
  expectedImpact: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
};

export function getDshRecommendationConfidenceLabel(confidence: DshRecommendationConfidence) {
  if (confidence === 'high') {
    return 'ثقة عالية';
  }

  if (confidence === 'medium') {
    return 'ثقة متوسطة';
  }

  return 'ثقة منخفضة';
}

export function getDshRecommendationSeverityLabel(severity: DshRecommendationSeverity) {
  if (severity === 'critical') {
    return 'حرج';
  }

  if (severity === 'high') {
    return 'مرتفع';
  }

  if (severity === 'medium') {
    return 'متوسط';
  }

  return 'منخفض';
}
