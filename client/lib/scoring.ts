export type Archetype = 
  | 'PERMISSIONLESS_OPERATOR'
  | 'SYSTEMS_THINKER'
  | 'AUDIENCE_BUILDER'
  | 'CREATOR_OBSESSIVE'
  | 'HYBRID_HUSTLER'
  | 'VALIDATOR_SEEKER'
  | 'THE_BUILDER'
  | 'THE_THINKER_WRITER'
  | 'THE_CONNECTOR';

export type Dimension = 
  | 'decision_making'
  | 'energy_source'
  | 'risk_tolerance'
  | 'focus'
  | 'motivation'
  | 'time_preference'
  | 'collaboration'
  | 'monetization';

export interface Question {
  id: number;
  text: string;
  dimension: Dimension;
  weight: number; // 1 or -1 (to handle reverse questions)
}

// Sample questions based on the brief
export const QUESTIONS: Question[] = [
  { id: 1, text: "I make business decisions based on gut feeling, not data", dimension: 'decision_making', weight: 1 },
  { id: 2, text: "I feel most energized when working alone", dimension: 'energy_source', weight: 1 },
  { id: 3, text: "I prefer specializing in one thing over being versatile", dimension: 'focus', weight: 1 },
  { id: 4, text: "I create because I need to prove something to others", dimension: 'motivation', weight: 1 },
  { id: 5, text: "I’d rather build a product once and sell it forever than provide services", dimension: 'monetization', weight: 1 },
  { id: 6, text: "I get bored easily if I’m not learning something new", dimension: 'energy_source', weight: 1 },
  { id: 7, text: "I’m comfortable with financial uncertainty if I’m building something I believe in", dimension: 'risk_tolerance', weight: 1 },
  { id: 8, text: "I need external validation to feel successful", dimension: 'motivation', weight: 1 },
  // ... (In a real app, all 50 questions would be here)
];

// Map dimensions to archetypes based on the brief
// Each archetype has a "target profile" of scores across dimensions (1-5)
export const ARCHETYPE_PROFILES: Record<Archetype, Partial<Record<Dimension, number>>> = {
  PERMISSIONLESS_OPERATOR: {
    decision_making: 5, // Fast, intuitive
    risk_tolerance: 5,  // High
    collaboration: 1,   // Solo
    energy_source: 4,   // Action bias
  },
  SYSTEMS_THINKER: {
    decision_making: 1, // Analytical, slow
    focus: 5,           // Optimization
    time_preference: 5, // Long-term
  },
  AUDIENCE_BUILDER: {
    collaboration: 5,   // People connection
    motivation: 5,      // External validation/engagement
    energy_source: 5,   // People
  },
  CREATOR_OBSESSIVE: {
    motivation: 1,      // Intrinsic
    focus: 5,           // Craft focus
    monetization: 1,    // Secondary to craft
  },
  HYBRID_HUSTLER: {
    focus: 1,           // Jack of all trades
    risk_tolerance: 4,  // Versatile
  },
  VALIDATOR_SEEKER: {
    motivation: 5,      // External validation
    risk_tolerance: 1,  // Perfectionism/Needs certainty
  },
  THE_BUILDER: {
    focus: 5,           // Product focus
    monetization: 5,    // Building once/selling
    collaboration: 1,   // Solo/Product-led
  },
  THE_THINKER_WRITER: {
    decision_making: 1, // Abstract, deep
    collaboration: 1,   // Solo
    focus: 5,           // Depth over breadth
  },
  THE_CONNECTOR: {
    collaboration: 5,   // Network building
    monetization: 4,    // Platform/Syndication
  },
};

export function calculateArchetype(responses: { questionId: number, value: number }[]) {
  const dimensionScores: Record<Dimension, { total: number, count: number }> = {
    decision_making: { total: 0, count: 0 },
    energy_source: { total: 0, count: 0 },
    risk_tolerance: { total: 0, count: 0 },
    focus: { total: 0, count: 0 },
    motivation: { total: 0, count: 0 },
    time_preference: { total: 0, count: 0 },
    collaboration: { total: 0, count: 0 },
    monetization: { total: 0, count: 0 },
  };

  responses.forEach(res => {
    const question = QUESTIONS.find(q => q.id === res.questionId);
    if (question) {
      // If weight is -1, 5 becomes 1, 4 becomes 2, etc.
      const adjustedValue = question.weight === 1 ? res.value : (6 - res.value);
      dimensionScores[question.dimension].total += adjustedValue;
      dimensionScores[question.dimension].count += 1;
    }
  });

  const averageScores: Partial<Record<Dimension, number>> = {};
  (Object.keys(dimensionScores) as Dimension[]).forEach(dim => {
    if (dimensionScores[dim].count > 0) {
      averageScores[dim] = dimensionScores[dim].total / dimensionScores[dim].count;
    }
  });

  // Calculate similarity to each archetype profile
  const archetypeSimilarities = (Object.keys(ARCHETYPE_PROFILES) as Archetype[]).map(arch => {
    const profile = ARCHETYPE_PROFILES[arch];
    let distance = 0;
    let dimensionsCompared = 0;

    (Object.keys(profile) as Dimension[]).forEach(dim => {
      const userScore = averageScores[dim];
      const targetScore = profile[dim];
      if (userScore !== undefined && targetScore !== undefined) {
        distance += Math.pow(userScore - targetScore, 2);
        dimensionsCompared++;
      }
    });

    const score = dimensionsCompared > 0 ? 1 / (1 + Math.sqrt(distance / dimensionsCompared)) : 0;
    return { archetype: arch, score };
  });

  archetypeSimilarities.sort((a, b) => b.score - a.score);

  const primary = archetypeSimilarities[0];
  const secondary = archetypeSimilarities[1];

  // Hybrid logic: if within 10%
  const isHybrid = secondary && (primary.score - secondary.score) < 0.1;

  return {
    primary: primary.archetype,
    primaryScore: primary.score,
    secondary: isHybrid ? secondary.archetype : null,
    secondaryScore: isHybrid ? secondary.score : null,
    allScores: archetypeSimilarities
  };
}

