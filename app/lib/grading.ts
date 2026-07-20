// CEFR-aligned grading, per "CEFR-Aligned Level Test Database & Grading System" spec:
// each correct answer = 1 point, cumulative score maps to a CEFR band.

export type CefrCode = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type CefrBandTemplate = {
  code: CefrCode;
  name: string;
  description: string;
  minScore: number;
  maxScore: number;
};

// Default 60-question standard from the reference PDF. When a test has a
// different question count, ranges are scaled proportionally.
export const STANDARD_CEFR_BANDS: CefrBandTemplate[] = [
  {
    code: "A1",
    name: "Beginner",
    description:
      "Focus on foundational syntax, basic vocabulary, simple present structures, and essential communicative phrases.",
    minScore: 0,
    maxScore: 10,
  },
  {
    code: "A2",
    name: "Elementary",
    description:
      "Recommended for pre-intermediate modules focusing on routine tasks, past simple narration, basic comparisons, and familiar environments.",
    minScore: 11,
    maxScore: 20,
  },
  {
    code: "B1",
    name: "Intermediate",
    description:
      "Possesses decent operational skills for general topics. Recommended for courses targeting standard functional language, expressing opinions, and connecting clauses.",
    minScore: 21,
    maxScore: 32,
  },
  {
    code: "B2",
    name: "Upper-Intermediate",
    description:
      "Can handle complex arguments and professional contexts. Recommended for advanced writing, idiomatic usage, and corporate communication modules.",
    minScore: 33,
    maxScore: 44,
  },
  {
    code: "C1",
    name: "Advanced",
    description:
      "Strong systematic mastery. Recommended for professional certifications, academic literature analysis, or high-level negotiation skills.",
    minScore: 45,
    maxScore: 54,
  },
  {
    code: "C2",
    name: "Proficiency",
    description:
      "Near-native fluency. Ready for career-specialized research, high-stakes public speaking, and advanced conceptual discourse.",
    minScore: 55,
    maxScore: 60,
  },
];

const STANDARD_TOTAL = 60;

/** Scales the standard 60-point CEFR bands to a test's actual question count. */
export function buildCefrBandsForQuestionCount(totalQuestions: number): CefrBandTemplate[] {
  if (totalQuestions <= 0) return STANDARD_CEFR_BANDS;

  const scaled = STANDARD_CEFR_BANDS.map((band) => ({
    ...band,
    minScore: Math.round((band.minScore / STANDARD_TOTAL) * totalQuestions),
    maxScore: Math.round((band.maxScore / STANDARD_TOTAL) * totalQuestions),
  }));

  // Keep bands contiguous and ensure the last one reaches the true max.
  for (let i = 1; i < scaled.length; i++) {
    scaled[i].minScore = scaled[i - 1].maxScore + 1;
  }
  scaled[0].minScore = 0;
  scaled[scaled.length - 1].maxScore = totalQuestions;

  return scaled;
}

export type LevelBand = {
  code: string;
  name: string;
  minScore: number;
  maxScore: number;
};

/** Finds the level whose score range contains the given score. */
export function resolveLevelForScore<T extends LevelBand>(
  score: number,
  levels: T[]
): T | null {
  const sorted = [...levels].sort((a, b) => a.minScore - b.minScore);
  for (const level of sorted) {
    if (score >= level.minScore && score <= level.maxScore) {
      return level;
    }
  }
  // fall back to the closest band if score is outside all defined ranges
  if (sorted.length === 0) return null;
  return score < sorted[0].minScore ? sorted[0] : sorted[sorted.length - 1];
}
