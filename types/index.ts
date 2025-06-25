export interface Risk {
  risk: string;
  level: '낮음' | '중간' | '높음';
  reason: string;
}

export interface Competitor {
  competitor: string;
  weakness: string;
}

export interface ValidationResult {
  summary: string;
  evaluation: {
    market: {
      sizeEstimation: string;
      targetUsers: string[];
      painPoints: string;
    };
    differentiation: {
      uniqueValue: string;
      competitiveLandscape: Competitor[];
      strengths: string[];
      weaknesses: string[];
    };
    risk: {
      technical: Risk[];
      market: Risk[];
      regulatory: Risk[];
      financial: Risk[];
    };
    feasibility: {
      score: number;
      scale: number;
      justification: string;
    };
  };
  recommendations: string[];
}

export interface IdeaSubmission {
  idea: string;
} 