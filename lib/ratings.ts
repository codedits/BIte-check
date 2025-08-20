export const CATEGORY_KEYS = ['taste','presentation','service','ambiance','value'] as const;
export type CategoryKey = typeof CATEGORY_KEYS[number];

export const RATING_WEIGHTS: Record<CategoryKey, number> = {
  taste: 40,
  presentation: 15,
  service: 15,
  ambiance: 15,
  value: 15
};

export function computeWeightedRating(values: Partial<Record<CategoryKey, number>>): number {
  const totalWeight = Object.values(RATING_WEIGHTS).reduce((s,v)=>s+v,0);
  const weightedSum = CATEGORY_KEYS.reduce((sum,k)=> sum + ((values[k]||0) * RATING_WEIGHTS[k]), 0);
  if (!totalWeight) return 0;
  return Math.round((weightedSum / totalWeight) * 10) / 10; // one decimal
}

export function allCategoriesRated(values: Partial<Record<CategoryKey, number>>): boolean {
  return CATEGORY_KEYS.every(k => typeof values[k] === 'number' && (values[k]||0) > 0);
}
